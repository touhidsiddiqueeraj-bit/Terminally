/**
 * Verify screenshots: valid PNG, correct size, dark theme, not blank.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "docs", "screenshots");

(async () => {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
  let bad = 0;
  for (const f of files) {
    const img = sharp(path.join(dir, f));
    const meta = await img.metadata();
    const stats = await img.stats();
    const [r, g, b] = stats.channels.map((c) => c.mean);
    const isDark = r < 60 && g < 60 && b < 60;
    const stdev = stats.channels.map((c) => c.stdev);
    const hasVariety = Math.max(...stdev) > 10; // not a flat blank image
    const ok = meta.width >= 380 && isDark && hasVariety;
    if (!ok) bad++;
    console.log(
      `${ok ? "OK " : "BAD"} ${f}: ${meta.width}x${meta.height}, ` +
        `mean rgb(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)}), ` +
        `stdev max ${Math.max(...stdev).toFixed(0)}`,
    );
  }
  process.exit(bad === 0 ? 0 : 1);
})();
