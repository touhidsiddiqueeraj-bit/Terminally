"use client";

/**
 * Sandboxed JS runner ("Training Grounds").
 * User code + tests execute inside a hidden iframe with sandbox="allow-scripts"
 * — no same-origin access, no network, no DOM access to the app.
 * Works fully offline.
 */

export type TestSpec = { name: string; code: string };

export type RunResult = {
  logs: string[];
  results: { name: string; pass: boolean; error?: string }[] | null;
  error: string | null;
  timedOut: boolean;
};

const RUNNER_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
(function () {
  function fmt(v, depth) {
    depth = depth || 0;
    try {
      if (v === null) return "null";
      if (v === undefined) return "undefined";
      if (typeof v === "string") return depth === 0 ? v : JSON.stringify(v);
      if (typeof v === "function") return "[function " + (v.name || "anonymous") + "]";
      if (typeof v === "object") {
        if (depth > 3) return "[...]";
        if (Array.isArray(v)) return "[" + v.map(function (x) { return fmt(x, depth + 1); }).join(", ") + "]";
        var parts = [];
        for (var k in v) { if (Object.prototype.hasOwnProperty.call(v, k)) parts.push(k + ": " + fmt(v[k], depth + 1)); }
        return "{ " + parts.join(", ") + " }";
      }
      return String(v);
    } catch (e) {
      return String(v);
    }
  }

  window.addEventListener("message", function (ev) {
    var data = ev.data || {};
    if (data.type !== "ta-run") return;

    var logs = [];
    var write = function () {
      try {
        var parts = [];
        for (var i = 0; i < arguments.length; i++) parts.push(fmt(arguments[i], 0));
        logs.push(parts.join(" "));
      } catch (e) { /* ignore */ }
    };
    ["log", "info", "warn", "error", "debug"].forEach(function (m) { console[m] = write; });
    window.alert = function () { write("[alert is disabled in the sandbox]"); };
    window.prompt = function () { write("[prompt is disabled in the sandbox]"); return null; };
    window.confirm = function () { write("[confirm is disabled in the sandbox]"); return false; };

    var resp = { type: "ta-result", runId: data.runId, logs: [], results: null, error: null };

    try {
      if (data.userCode && data.userCode.length) {
        new Function(data.userCode)();
      }
    } catch (err) {
      resp.error = err && err.name ? (err.name + ": " + (err.message || "")) : String(err);
    }

    if (!resp.error && data.tests && data.tests.length) {
      resp.results = data.tests.map(function (t) {
        try {
          var body = '"use strict";' + data.userCode + "\\n;return (function(){" + t.code + "})();";
          var fn = new Function(body);
          return { name: t.name, pass: !!fn() };
        } catch (e2) {
          return { name: t.name, pass: false, error: String((e2 && e2.message) || e2) };
        }
      });
    }

    resp.logs = logs;
    try { parent.postMessage(resp, "*"); } catch (e) { /* ignore */ }
  });
})();
</script>
</body>
</html>`;

const TIMEOUT_MS = 6000;

export class CodeRunner {
  private iframe: HTMLIFrameElement | null = null;
  private runId = 0;
  private pending:
    | {
        runId: number;
        resolve: (r: RunResult) => void;
        timer: ReturnType<typeof setTimeout>;
      }
    | null = null;
  private messageHandler: ((ev: MessageEvent) => void) | null = null;

  private ensureIframe(): Promise<HTMLIFrameElement> {
    if (this.iframe) return Promise.resolve(this.iframe);
    return new Promise((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("sandbox", "allow-scripts");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.srcdoc = RUNNER_HTML;
      iframe.addEventListener("load", () => resolve(iframe), { once: true });
      document.body.appendChild(iframe);
      this.iframe = iframe;
    });
  }

  private installListener() {
    if (this.messageHandler) return;
    this.messageHandler = (ev: MessageEvent) => {
      const data = ev.data;
      if (!data || data.type !== "ta-result" || !this.pending) return;
      if (data.runId !== this.pending.runId) return;
      clearTimeout(this.pending.timer);
      const resolve = this.pending.resolve;
      this.pending = null;
      resolve({
        logs: Array.isArray(data.logs) ? data.logs : [],
        results: Array.isArray(data.results) ? data.results : null,
        error: typeof data.error === "string" ? data.error : null,
        timedOut: false,
      });
    };
    window.addEventListener("message", this.messageHandler);
  }

  async run(userCode: string, tests?: TestSpec[]): Promise<RunResult> {
    this.installListener();
    // A previous run is still in flight (or stuck) — recycle the frame.
    if (this.pending) {
      this.cancelPending();
      this.destroyIframe();
    }
    const iframe = await this.ensureIframe();
    this.runId += 1;
    const runId = this.runId;
    return new Promise<RunResult>((resolve) => {
      const timer = setTimeout(() => {
        if (this.pending && this.pending.runId === runId) {
          this.pending = null;
          this.destroyIframe();
          resolve({
            logs: [],
            results: null,
            error:
              "Execution timed out after 6 seconds. Check for an infinite loop — does your loop's exit condition ever become false?",
            timedOut: true,
          });
        }
      }, TIMEOUT_MS);
      this.pending = { runId, resolve, timer };
      iframe.contentWindow?.postMessage(
        { type: "ta-run", runId, userCode, tests: tests ?? [] },
        "*",
      );
    });
  }

  private cancelPending() {
    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending.resolve({
        logs: [],
        results: null,
        error: "Run cancelled.",
        timedOut: false,
      });
      this.pending = null;
    }
  }

  private destroyIframe() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
  }

  destroy() {
    this.cancelPending();
    this.destroyIframe();
    if (this.messageHandler) {
      window.removeEventListener("message", this.messageHandler);
      this.messageHandler = null;
    }
  }
}

/** Shared singleton for the whole app. */
let sharedRunner: CodeRunner | null = null;

export function getRunner(): CodeRunner {
  if (!sharedRunner) sharedRunner = new CodeRunner();
  return sharedRunner;
}
