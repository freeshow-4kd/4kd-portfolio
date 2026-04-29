import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const assetsDir = join(root, "assets");
const worksDir = join(assetsDir, "works");

mkdirSync(worksDir, { recursive: true });

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  t.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([t, data])), 8 + data.length);
  return out;
}

function png(width, height, rgba) {
  const scanlines = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    scanlines[row] = 0;
    rgba.copy(scanlines, row + 1, y * width * 4, (y + 1) * width * 4);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function hex(value) {
  const num = Number.parseInt(value.replace("#", ""), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function mix(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function seeded(seed) {
  let x = seed >>> 0;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 0xffffffff;
  };
}

function image(width, height, fill) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const [r, g, b, a] = fill(x, y);
      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = a;
    }
  }
  return {
    width,
    height,
    rgba,
    set(x, y, c) {
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const a = (c[3] ?? 255) / 255;
      rgba[i] = Math.round(rgba[i] * (1 - a) + c[0] * a);
      rgba[i + 1] = Math.round(rgba[i + 1] * (1 - a) + c[1] * a);
      rgba[i + 2] = Math.round(rgba[i + 2] * (1 - a) + c[2] * a);
      rgba[i + 3] = 255;
    },
    save(file) {
      writeFileSync(file, png(width, height, rgba));
    },
  };
}

function rect(img, x, y, w, h, c) {
  for (let yy = Math.max(0, y); yy < Math.min(img.height, y + h); yy += 1) {
    for (let xx = Math.max(0, x); xx < Math.min(img.width, x + w); xx += 1) img.set(xx, yy, c);
  }
}

function line(img, x1, y1, x2, y2, c, thickness = 1) {
  const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    rect(img, Math.round(x - thickness / 2), Math.round(y - thickness / 2), thickness, thickness, c);
  }
}

function ellipse(img, cx, cy, rx, ry, c, stroke = false) {
  const left = Math.floor(cx - rx);
  const right = Math.ceil(cx + rx);
  const top = Math.floor(cy - ry);
  const bottom = Math.ceil(cy + ry);
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (stroke ? d > 0.94 && d < 1.04 : d <= 1) img.set(x, y, c);
    }
  }
}

function triangle(img, ax, ay, bx, by, cx, cy, c) {
  const minX = Math.floor(Math.min(ax, bx, cx));
  const maxX = Math.ceil(Math.max(ax, bx, cx));
  const minY = Math.floor(Math.min(ay, by, cy));
  const maxY = Math.ceil(Math.max(ay, by, cy));
  const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const w1 = ((bx - ax) * (y - ay) - (by - ay) * (x - ax)) / area;
      const w2 = ((cx - bx) * (y - by) - (cy - by) * (x - bx)) / area;
      const w3 = ((ax - cx) * (y - cy) - (ay - cy) * (x - cx)) / area;
      if ((w1 >= 0 && w2 >= 0 && w3 >= 0) || (w1 <= 0 && w2 <= 0 && w3 <= 0)) img.set(x, y, c);
    }
  }
}

function workAsset(index) {
  const width = 960;
  const height = 640;
  const rand = seeded(index * 4187 + 73);
  const accents = ["#c7ff62", "#f1c75f", "#82dbff", "#e7e0cd", "#8effc0"];
  const accent = hex(accents[index % accents.length]);
  const baseA = hex(index % 3 === 0 ? "#0e1110" : "#11130f");
  const baseB = hex(index % 2 === 0 ? "#20241b" : "#191d22");

  const img = image(width, height, (x, y) => {
    const dx = (x - width * (0.45 + rand() * 0.2)) / width;
    const dy = (y - height * 0.48) / height;
    const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 2.5);
    const g = mix(baseA, baseB, y / height * 0.85 + glow * 0.35);
    return [g[0], g[1], g[2], 255];
  });

  for (let x = 0; x < width; x += 48) line(img, x, 0, x, height, [255, 255, 255, 12], 1);
  for (let y = 0; y < height; y += 48) line(img, 0, y, width, y, [255, 255, 255, 10], 1);

  ellipse(img, width * (0.35 + rand() * 0.35), height * (0.42 + rand() * 0.18), 190 + rand() * 130, 190 + rand() * 80, [accent[0], accent[1], accent[2], 28], true);
  ellipse(img, width * (0.72 - rand() * 0.3), height * (0.38 + rand() * 0.22), 80 + rand() * 160, 80 + rand() * 120, [accent[0], accent[1], accent[2], 18], false);

  const panelW = 250 + rand() * 300;
  const panelH = 170 + rand() * 170;
  const px = 80 + rand() * (width - panelW - 160);
  const py = 80 + rand() * (height - panelH - 150);
  rect(img, px, py, panelW, panelH, [8, 10, 9, 190]);
  rect(img, px, py, panelW, 1, [accent[0], accent[1], accent[2], 150]);
  rect(img, px, py + panelH - 1, panelW, 1, [255, 255, 255, 38]);
  rect(img, px, py, 1, panelH, [255, 255, 255, 35]);
  rect(img, px + panelW - 1, py, 1, panelH, [255, 255, 255, 25]);

  for (let i = 0; i < 8; i += 1) {
    const yy = py + 34 + i * 24;
    const ww = panelW * (0.28 + rand() * 0.58);
    rect(img, px + 34, yy, ww, 2, i === 0 ? [accent[0], accent[1], accent[2], 180] : [230, 228, 215, 65]);
  }

  for (let i = 0; i < 6; i += 1) {
    const size = 34 + rand() * 92;
    const x = 60 + rand() * (width - 120);
    const y = 70 + rand() * (height - 140);
    if (i % 3 === 0) rect(img, x, y, size * 1.7, size, [accent[0], accent[1], accent[2], 36]);
    if (i % 3 === 1) ellipse(img, x, y, size, size, [255, 255, 255, 22], true);
    if (i % 3 === 2) triangle(img, x, y + size, x + size * 1.4, y, x + size * 1.8, y + size * 1.5, [accent[0], accent[1], accent[2], 28]);
  }

  rect(img, 56, height - 84, 110, 2, [accent[0], accent[1], accent[2], 180]);
  rect(img, 56, height - 64, 220 + rand() * 260, 1, [255, 255, 255, 58]);
  rect(img, width - 190, 54, 110, 1, [255, 255, 255, 42]);
  rect(img, width - 190, 72, 70, 1, [accent[0], accent[1], accent[2], 120]);

  img.save(join(worksDir, `work-${String(index).padStart(2, "0")}.png`));
}

function profileAsset() {
  const width = 900;
  const height = 1200;
  const bgA = hex("#090b0a");
  const bgB = hex("#181d18");
  const accent = hex("#c7ff62");

  const img = image(width, height, (x, y) => {
    const cx = width * 0.58;
    const cy = height * 0.38;
    const d = Math.hypot((x - cx) / width, (y - cy) / height);
    const glow = Math.max(0, 1 - d * 3.1);
    const v = mix(bgA, bgB, y / height * 0.8 + glow * 0.55);
    return [v[0], v[1], v[2], 255];
  });

  for (let x = 0; x < width; x += 42) line(img, x, 0, x, height, [255, 255, 255, 11], 1);
  for (let y = 0; y < height; y += 42) line(img, 0, y, width, y, [255, 255, 255, 9], 1);

  ellipse(img, 555, 380, 245, 245, [accent[0], accent[1], accent[2], 42], false);
  ellipse(img, 555, 380, 245, 245, [accent[0], accent[1], accent[2], 105], true);
  ellipse(img, 555, 380, 155, 155, [0, 0, 0, 70], false);

  ellipse(img, 496, 345, 100, 128, [5, 6, 6, 246], false);
  triangle(img, 520, 345, 620, 398, 514, 428, [5, 6, 6, 246]);
  ellipse(img, 461, 294, 95, 70, [3, 4, 4, 250], false);
  rect(img, 475, 460, 83, 215, [5, 6, 6, 248]);
  ellipse(img, 500, 757, 285, 230, [6, 7, 7, 250], false);
  triangle(img, 300, 617, 675, 640, 742, 990, [6, 7, 7, 248]);
  triangle(img, 240, 1040, 430, 720, 690, 1160, [6, 7, 7, 248]);

  line(img, 345, 260, 620, 475, [255, 255, 255, 12], 2);
  line(img, 590, 315, 642, 332, [255, 255, 255, 25], 2);
  rect(img, 112, 900, 172, 2, [accent[0], accent[1], accent[2], 150]);
  rect(img, 112, 922, 280, 1, [255, 255, 255, 48]);
  img.save(join(assetsDir, "profile-placeholder.png"));
}

profileAsset();
for (let i = 1; i <= 50; i += 1) workAsset(i);
