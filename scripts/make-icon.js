const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { execFileSync } = require("node:child_process");

const buildDir = path.join(__dirname, "..", "build");
const blue = { r: 0x00, g: 0x2f, b: 0xa7 };

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
}

function writeBlueDotPng(filePath, imageSize) {
  const radius = imageSize * 0.39;
  const center = (imageSize - 1) / 2;
  const rows = [];

  for (let y = 0; y < imageSize; y += 1) {
    const row = Buffer.alloc(1 + imageSize * 4);
    row[0] = 0;
    for (let x = 0; x < imageSize; x += 1) {
      const distance = Math.hypot(x - center, y - center);
      const alpha = distance <= radius ? 255 : 0;
      const pixelOffset = 1 + x * 4;
      row[pixelOffset] = blue.r;
      row[pixelOffset + 1] = blue.g;
      row[pixelOffset + 2] = blue.b;
      row[pixelOffset + 3] = alpha;
    }
    rows.push(row);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(imageSize, 0);
  header.writeUInt32BE(imageSize, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  fs.writeFileSync(
    filePath,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      pngChunk("IHDR", header),
      pngChunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
      pngChunk("IEND", Buffer.alloc(0))
    ])
  );
}

const size = 256;
const xorBytesPerRow = size * 4;
const andBytesPerRow = Math.ceil(size / 32) * 4;
const dibSize = 40 + xorBytesPerRow * size + andBytesPerRow * size;
const icoSize = 6 + 16 + dibSize;
const buffer = Buffer.alloc(icoSize);

let offset = 0;
buffer.writeUInt16LE(0, offset);
offset += 2;
buffer.writeUInt16LE(1, offset);
offset += 2;
buffer.writeUInt16LE(1, offset);
offset += 2;

buffer.writeUInt8(size === 256 ? 0 : size, offset++);
buffer.writeUInt8(size === 256 ? 0 : size, offset++);
buffer.writeUInt8(0, offset++);
buffer.writeUInt8(0, offset++);
buffer.writeUInt16LE(1, offset);
offset += 2;
buffer.writeUInt16LE(32, offset);
offset += 2;
buffer.writeUInt32LE(dibSize, offset);
offset += 4;
buffer.writeUInt32LE(22, offset);
offset += 4;

buffer.writeUInt32LE(40, offset);
offset += 4;
buffer.writeInt32LE(size, offset);
offset += 4;
buffer.writeInt32LE(size * 2, offset);
offset += 4;
buffer.writeUInt16LE(1, offset);
offset += 2;
buffer.writeUInt16LE(32, offset);
offset += 2;
buffer.writeUInt32LE(0, offset);
offset += 4;
buffer.writeUInt32LE(xorBytesPerRow * size, offset);
offset += 4;
buffer.writeInt32LE(0, offset);
offset += 4;
buffer.writeInt32LE(0, offset);
offset += 4;
buffer.writeUInt32LE(0, offset);
offset += 4;
buffer.writeUInt32LE(0, offset);
offset += 4;

const center = (size - 1) / 2;
const radius = 100;
for (let y = size - 1; y >= 0; y -= 1) {
  for (let x = 0; x < size; x += 1) {
    const distance = Math.hypot(x - center, y - center);
    const alpha = distance <= radius ? 255 : 0;
    buffer.writeUInt8(blue.b, offset++);
    buffer.writeUInt8(blue.g, offset++);
    buffer.writeUInt8(blue.r, offset++);
    buffer.writeUInt8(alpha, offset++);
  }
}

offset += andBytesPerRow * size;

fs.mkdirSync(buildDir, { recursive: true });
fs.writeFileSync(path.join(buildDir, "icon.ico"), buffer);
writeBlueDotPng(path.join(buildDir, "icon-1024.png"), 1024);
writeBlueDotPng(path.join(buildDir, "iconTemplate.png"), 16);

if (process.platform === "darwin") {
  const iconsetDir = path.join(buildDir, "icon.iconset");
  fs.rmSync(iconsetDir, { recursive: true, force: true });
  fs.mkdirSync(iconsetDir, { recursive: true });

  const sizes = [16, 32, 64, 128, 256, 512, 1024];
  for (const iconSize of sizes) {
    execFileSync("sips", [
      "-z",
      String(iconSize),
      String(iconSize),
      path.join(buildDir, "icon-1024.png"),
      "--out",
      path.join(iconsetDir, `icon_${iconSize}x${iconSize}.png`)
    ], { stdio: "ignore" });
  }

  execFileSync("cp", [
    path.join(iconsetDir, "icon_32x32.png"),
    path.join(iconsetDir, "icon_16x16@2x.png")
  ]);
  execFileSync("cp", [
    path.join(iconsetDir, "icon_64x64.png"),
    path.join(iconsetDir, "icon_32x32@2x.png")
  ]);
  execFileSync("cp", [
    path.join(iconsetDir, "icon_256x256.png"),
    path.join(iconsetDir, "icon_128x128@2x.png")
  ]);
  execFileSync("cp", [
    path.join(iconsetDir, "icon_512x512.png"),
    path.join(iconsetDir, "icon_256x256@2x.png")
  ]);
  execFileSync("cp", [
    path.join(iconsetDir, "icon_1024x1024.png"),
    path.join(iconsetDir, "icon_512x512@2x.png")
  ]);
  execFileSync("iconutil", [
    "-c",
    "icns",
    iconsetDir,
    "-o",
    path.join(buildDir, "icon.icns")
  ]);
}
