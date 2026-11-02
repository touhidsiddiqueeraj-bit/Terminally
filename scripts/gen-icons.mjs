/**
 * Generates PWA icons for Terminal Academy:
 * a dark terminal tile with a neon-green ">_" prompt.
 * Run: node scripts/gen-icons.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function iconSvg({ size, maskable }) {
  const pad = maskable ? size * 0.22 : 0; // safe zone for maskable
  const inner = size - pad * 2;
  const stroke = Math.max(2, size / 128);
  // ">_" glyph geometry relative to inner box
  const gw = inner * 0.62; // glyph width
  const gh = inner * 0.46; // glyph height
  const gx = pad + (inner - gw) / 2;
  const gy = pad + (inner - gh) / 2;
  const lineWidth = Math.max(4, size / 42);
  const promptColor = "#22e394";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c1712"/>
      <stop offset="1" stop-color="#060a08"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${maskable ? 0 : Math.round(size * 0.12)}" fill="url(#bg)"/>
  ${
    maskable
      ? ""
      : `<rect x="${stroke}" y="${stroke}" width="${size - stroke * 2}" height="${size - stroke * 2}" rx="${Math.round(size * 0.1)}" fill="none" stroke="#22e394" stroke-opacity="0.45" stroke-width="${stroke * 2}"/>`
  }
  <!-- > chevron -->
  <polyline
    points="${gx},${gy} ${gx + gw * 0.42},${gy + gh / 2} ${gx},${gy + gh}"
    fill="none" stroke="${promptColor}" stroke-width="${lineWidth}"
    stroke-linecap="square" stroke-linejoin="miter"/>
  <!-- _ underscore -->
  <rect x="${gx + gw * 0.52}" y="${gy + gh - lineWidth}" width="${gw * 0.48}" height="${lineWidth}" fill="${promptColor}"/>
</svg>`;
}

const outDir = path.join(__dirname, "..", "public", "icons");
const targets = [
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "maskable-512.png", size: 512, maskable: true },
  { file: "apple-touch-icon.png", size: 180, maskable: false },
];

for (const t of targets) {
  await sharp(Buffer.from(iconSvg(t)))
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, t.file));
  console.log("wrote", t.file);
}
