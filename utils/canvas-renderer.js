const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");
const {
  createCanvas,
  Image,
  GlobalFonts,
  loadImage,
  Path2D,
} = require("@napi-rs/canvas");

const W = 1504;
const H = 846;

// ── Font setup ──────────────────────────────────────────────────────────────

/** Convert a WOFF buffer to TTF (librsvg-compatible). */
const woffToTtf = (woff) => {
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);
  const tables = [];
  let dir = 44;
  for (let i = 0; i < numTables; i++) {
    const tag = woff.slice(dir, dir + 4).toString("ascii");
    const woffOffset = woff.readUInt32BE(dir + 4);
    const compLen = woff.readUInt32BE(dir + 8);
    const origLen = woff.readUInt32BE(dir + 12);
    const checksum = woff.readUInt32BE(dir + 16);
    dir += 20;
    let data = woff.slice(woffOffset, woffOffset + compLen);
    if (compLen < origLen) data = zlib.inflateSync(data);
    const pad = (4 - (data.length % 4)) % 4;
    tables.push({
      tag,
      checksum,
      origLen,
      data: Buffer.concat([data, Buffer.alloc(pad)]),
    });
  }
  tables.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));
  const n = tables.length;
  const exp = Math.floor(Math.log2(n));
  const searchRange = 2 ** exp * 16;
  const headerSize = 12 + n * 16;
  let cursor = headerSize;
  for (const t of tables) {
    t.sfntOffset = cursor;
    cursor += t.data.length;
  }
  const out = Buffer.alloc(cursor);
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(n, 4);
  out.writeUInt16BE(searchRange, 6);
  out.writeUInt16BE(Math.floor(Math.log2(n)), 8);
  out.writeUInt16BE(n * 16 - searchRange, 10);
  let d = 12;
  for (const t of tables) {
    out.write(t.tag, d, 4, "ascii");
    out.writeUInt32BE(t.checksum, d + 4);
    out.writeUInt32BE(t.sfntOffset, d + 8);
    out.writeUInt32BE(t.origLen, d + 12);
    d += 16;
  }
  for (const t of tables) t.data.copy(out, t.sfntOffset);
  return out;
};

const FONTS_DIR_LOCAL = path.resolve(__dirname, "..", "fonts");

for (const w of [400, 500, 600, 700]) {
  const localPath = path.join(FONTS_DIR_LOCAL, `exo-2-${w}.ttf`);

  if (fs.existsSync(localPath)) {
    // Use committed TTF directly — works on read-only filesystems (e.g. Vercel)
    GlobalFonts.registerFromPath(localPath, "Exo 2");
  } else {
    // Fallback: generate from WOFF into /tmp (environments without committed fonts)
    const tmpDir = path.join(os.tmpdir(), "trakt-exo2-fonts");
    fs.mkdirSync(tmpDir, { recursive: true });
    const tmpPath = path.join(tmpDir, `exo-2-${w}.ttf`);
    if (!fs.existsSync(tmpPath)) {
      const woff = fs.readFileSync(
        require.resolve(`@fontsource/exo-2/files/exo-2-latin-${w}-normal.woff`),
      );
      fs.writeFileSync(tmpPath, woffToTtf(woff));
    }
    GlobalFonts.registerFromPath(tmpPath, "Exo 2");
  }
}
console.log("[canvas] Exo 2 fonts registered from", FONTS_DIR_LOCAL);

/**
 * Draws a rounded rectangle path.
 */
const roundedRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
};

/**
 * Renders the card to a Buffer.
 * @param {{ data: object, format: "jpeg"|"png"|"webp", scale?: number }} opts
 * @returns {Promise<{ buffer: Buffer, mime: string }>}
 */
const renderCard = async ({ data, format = "jpeg", scale = 1 }) => {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // ── Clip to rounded rect ────────────────────────────────────────────────
  roundedRect(ctx, 0, 0, W, H, 24);
  ctx.clip();

  // ── Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);

  // ── Backdrop image ───────────────────────────────────────────────────────
  if (data.image) {
    try {
      const b64Part = data.image.split(",")[1];
      const imgBuf = Buffer.from(b64Part, "base64");
      const img = await loadImage(imgBuf);
      // Cover-fit: scale to fill then centre-crop
      const scale = Math.max(W / img.width, H / img.height);
      const nw = img.width * scale;
      const nh = img.height * scale;
      const ox = (nw - W) / 2;
      const oy = (nh - H) / 2;
      ctx.drawImage(img, -ox, -oy, nw, nh);
    } catch (e) {
      console.error("[canvas] backdrop error:", e.message);
    }
  }

  // ── Gradient overlay ────────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.25)");
  grad.addColorStop(1, "rgba(0,0,0,0.92)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // ── Badge ────────────────────────────────────────────────────────────────
  const BADGE = "RECENTLY WATCHED";
  ctx.font = "700 36px 'Exo 2'";
  const badgeTextW = ctx.measureText(BADGE).width;
  const badgeW = badgeTextW + 36;
  const BADGE_Y = 67;
  const BADGE_H = 56;
  roundedRect(ctx, 60, BADGE_Y, badgeW, BADGE_H, 8);
  ctx.fillStyle = "#9f42c6";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  // Use actualBoundingBoxAscent to perfectly centre the cap-height inside the badge
  ctx.textBaseline = "alphabetic";
  const bm = ctx.measureText(BADGE);
  const capAscent =
    bm.actualBoundingBoxAscent ?? bm.fontBoundingBoxAscent ?? 25;
  const capDescent =
    bm.actualBoundingBoxDescent ?? bm.fontBoundingBoxDescent ?? 5;
  const textY = BADGE_Y + (BADGE_H + capAscent - capDescent) / 2;
  ctx.fillText(BADGE, 78, textY);

  // ── Title ────────────────────────────────────────────────────────────────
  const el = data.element;
  let title = "";
  let meta = "";
  if (el) {
    if (el.type === "show") {
      title = el.title;
      meta = `S${String(el.season).padStart(2, "0")}E${String(el.episode).padStart(2, "0")}`;
      if (el.episode_title) meta += ` · ${el.episode_title}`;
    } else {
      title = el.title;
      meta = `${el.year}`;
    }
  }

  const displayTitle =
    title.length > 30 ? `${title.slice(0, 30).trimEnd()} ...` : title;

  ctx.font = "700 80px 'Exo 2'";
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(displayTitle, 60, 718);

  // ── Meta ─────────────────────────────────────────────────────────────────
  ctx.font = "400 48px 'Exo 2'";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(meta, 60, 788);

  // ── Username (rotated, bottom-right, baseline aligned with meta) ─────────
  const username = data.username || "";
  if (username) {
    ctx.save();
    ctx.translate(1460, 788); // same Y as meta baseline
    ctx.rotate(-Math.PI / 2);
    ctx.font = "600 36px 'Exo 2'";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(username, 0, 0);
    ctx.restore();
  }

  // ── Trakt logo (top-right) ──────────────────────────────────────────────
  {
    // SVG viewBox is 0 0 48 48, rendered at 110×110 → scale = 110/48
    const LOGO_X = 1354;
    const LOGO_Y = 40;
    const LOGO_SIZE = 110;
    const scale = LOGO_SIZE / 48;
    ctx.save();
    ctx.translate(LOGO_X, LOGO_Y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    const traktPath = new Path2D(
      "M30.17,30.22l-1.46-1.46,19.16-19.17c-.05-.39-.13-.77-.23-1.15l-20.31,20.33,2.16,2.16-1.46," +
        "1.46-3.62-3.62L46.85,6.29c-.15-.3-.31-.6-.5-.88l-23.33,23.35,4.31,4.31-1.46,1.46-14.39-14.4," +
        "1.46-1.46,8.62,8.62L45.1,3.72c-2.07-2.29-5.05-3.72-8.37-3.72H11.27C5.05,0,0,5.05,0,11.27v25.48" +
        "c0,6.22,5.05,11.26,11.27,11.26h25.47c6.22,0,11.27-5.04,11.27-11.26V12.38l-17.83,17.84Z" +
        "M21.54,25.91l-7.91-7.93,1.46-1.46,7.91,7.92-1.46,1.47Z" +
        "M23.69,23.74l-7.91-7.92,1.46-1.46,7.92,7.92-1.47,1.46Z" +
        "M43.4,35.12c0,4.57-3.71,8.28-8.28,8.28H12.88c-4.56,0-8.28-3.71-8.28-8.28V12.88" +
        "c0-4.57,3.71-8.28,8.28-8.28h20.78v2.08H12.88c-3.42,0-6.2,2.78-6.2,6.2v22.23" +
        "c0,3.42,2.78,6.21,6.2,6.21h22.24c3.42,0,6.2-2.79,6.2-6.21v-3.51h2.08v3.51Z",
    );
    ctx.fill(traktPath);
    ctx.restore();
  }

  // ── Downscale ─────────────────────────────────────────────────────────────
  let targetCanvas = canvas;
  if (scale !== 1) {
    const sw = Math.round(W * scale);
    const sh = Math.round(H * scale);
    targetCanvas = createCanvas(sw, sh);
    const sctx = targetCanvas.getContext("2d");
    sctx.drawImage(canvas, 0, 0, sw, sh);
  }

  // ── Encode ───────────────────────────────────────────────────────────────
  let buffer;
  let mime;
  switch (format) {
    case "png":
      buffer = await targetCanvas.encode("png");
      mime = "image/png";
      break;
    case "webp":
      buffer = await targetCanvas.encode("webp", 90);
      mime = "image/webp";
      break;
    default:
      buffer = await targetCanvas.encode("jpeg", 92);
      mime = "image/jpeg";
  }

  return { buffer, mime };
};

module.exports = { renderCard };
