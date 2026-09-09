#!/usr/bin/env node
/**
 * ACHEARE brand asset generator (temporary placeholder).
 *
 * Generates simple placeholder PNG icons (gradient rounded square + white
 * "A" monogram) used as the ACHEARE favicon / app icon until the final
 * ACHEARE logo asset is available.
 *
 * Run from the repository root:
 *   node scripts/generate-acheare-brand-assets.mjs
 *
 * When the final ACHEARE logo is provided, replace the files under
 * packages/twenty-front/public/images/icons/acheare/ with real assets
 * (keep the same file names) and delete this script.
 *
 * No third-party dependencies: PNG encoding uses Node's built-in zlib.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(
  ROOT,
  'packages/twenty-front/public/images/icons/acheare',
);

// Brand colors (match the placeholder SVG logo)
const COLOR_START = [0x4f, 0x46, 0xe5]; // indigo-600
const COLOR_END = [0x7c, 0x3a, 0xed]; // violet-600
const WHITE = [0xff, 0xff, 0xff];

// Rounded-square geometry, in a normalized 96x96 space
const SIZE = 96;
const CORNER_RADIUS = 24;

// "A" monogram geometry (normalized 96x96 space)
const APEX = { x: 48, y: 14 };
const LEFT_FOOT = { x: 24, y: 82 };
const RIGHT_FOOT = { x: 72, y: 82 };
const LEFT_INNER = { x: 34, y: 82 };
const RIGHT_INNER = { x: 62, y: 82 };
const CROSSBAR = { xMin: 33, xMax: 63, yMin: 49, yMax: 57 };

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const lerpColor = (t) =>
  COLOR_START.map((start, i) =>
    Math.round(start + (COLOR_END[i] - start) * clamp01(t)),
  );

const isInRoundedRect = (x, y) => {
  const r = CORNER_RADIUS;
  const nearestX = clamp01((x - r) / (SIZE - 2 * r)) * (SIZE - 2 * r) + r;
  const nearestY = clamp01((y - r) / (SIZE - 2 * r)) * (SIZE - 2 * r) + r;
  const dx = x - nearestX;
  const dy = y - nearestY;
  return dx * dx + dy * dy <= r * r;
};

const sign = (p1, p2, p3) =>
  (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);

const isInTriangle = (p, a, b, c) => {
  const d1 = sign(p, a, b);
  const d2 = sign(p, b, c);
  const d3 = sign(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
};

const isInAMonogram = (x, y) => {
  const point = { x, y };
  const inOuter = isInTriangle(point, APEX, LEFT_FOOT, RIGHT_FOOT);
  const inHole = isInTriangle(point, APEX, LEFT_INNER, RIGHT_INNER);
  const inCrossbar =
    x >= CROSSBAR.xMin &&
    x <= CROSSBAR.xMax &&
    y >= CROSSBAR.yMin &&
    y <= CROSSBAR.yMax;
  return (inOuter && !inHole) || inCrossbar;
};

const pixelColor = (px, py, size) => {
  // Map pixel center to 96x96 space
  const x = ((px + 0.5) / size) * SIZE;
  const y = ((py + 0.5) / size) * SIZE;

  if (!isInRoundedRect(x, y)) {
    return [0, 0, 0, 0]; // transparent outside the rounded square
  }

  const gradientT = (x + y) / (2 * SIZE);
  const base = lerpColor(gradientT);
  return isInAMonogram(x, y) ? [...WHITE, 255] : [...base, 255];
};

// --- Minimal PNG encoder (no dependencies) --------------------------------
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const typeBuf = Buffer.from(type, 'ascii');
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
};

const encodePng = (size, pixelGetter) => {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const raw = Buffer.alloc(size * (size * 4 + 1));
  let offset = 0;
  for (let y = 0; y < size; y++) {
    raw[offset++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelGetter(x, y, size);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

// --- Generate --------------------------------------------------------------
const SIZES = [16, 32, 48, 192, 512];
const FILE_NAMES = {
  16: 'icon-16x16.png',
  32: 'icon-32x32.png',
  48: 'favicon-48x48.png',
  192: 'icon-192x192.png',
  512: 'icon-512x512.png',
};

mkdirSync(OUT_DIR, { recursive: true });

for (const size of SIZES) {
  const png = encodePng(size, pixelColor);
  const filePath = join(OUT_DIR, FILE_NAMES[size]);
  writeFileSync(filePath, png);
  console.log(`Generated ${filePath} (${png.length} bytes)`);
}

console.log('\nPlaceholder ACHEARE icons generated.');
console.log('Replace these files with the final ACHEARE logo when available.');