import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

/**
 * FileUploadService — provider interface.
 * "local" writes to /public/uploads (works out of the box in dev).
 * "cloudinary" is wired for drop-in replacement once env keys are set.
 */

export interface UploadResult {
  url: string;
  provider: "local" | "cloudinary";
}

const MAX_BYTES = 8 * 1024 * 1024; // incoming cap — a raw 10MB+ camera photo is refused before it is read
const MAX_EDGE = 1600;
const WEBP_QUALITY = 75;

/**
 * Identifies the real image format from its magic bytes. The client-supplied `Content-Type` and
 * filename extension are both attacker-controlled (a request can claim `image/png` while naming
 * the file `x.html`) — only the actual byte content is trustworthy, so this is the sole source of
 * truth for what gets saved, both for the accept/reject decision and the extension on disk.
 */
function sniffImageType(buf: Buffer): { mime: string; ext: string } | null {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) {
    return { mime: "image/png", ext: "png" };
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (buf.length >= 6 && buf.toString("ascii", 0, 3) === "GIF" && ["87a", "89a"].includes(buf.toString("ascii", 3, 6))) {
    return { mime: "image/gif", ext: "gif" };
  }
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return { mime: "image/webp", ext: "webp" };
  }
  if (buf.length >= 12 && buf.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis", "mif1"].includes(buf.toString("ascii", 8, 12))) {
    return { mime: "image/avif", ext: "avif" };
  }
  return null;
}

/**
 * Resize and re-encode so a phone photo is never written to disk at its original size.
 * GIFs are stored only when they are already small; everything else becomes WebP.
 */
async function toStoredImage(buffer: Buffer, ext: string): Promise<{ buffer: Buffer; ext: string }> {
  if (ext === "gif") {
    if (buffer.length > 1_500_000) throw new Error("GIF is too large (max 1.5MB).");
    return { buffer, ext: "gif" };
  }

  const source = sharp(buffer, { failOn: "none", limitInputPixels: 40_000_000, animated: false });
  const meta = await source.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const alreadySmall = ext === "webp" && buffer.length <= 400 * 1024 && width > 0 && width <= MAX_EDGE && height <= MAX_EDGE;
  if (alreadySmall) return { buffer, ext: "webp" };

  const out = await sharp(buffer, { failOn: "none", limitInputPixels: 40_000_000, animated: false })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  return { buffer: out, ext: "webp" };
}

export async function uploadFile(file: File, folder = "products"): Promise<UploadResult> {
  if (file.size > MAX_BYTES) throw new Error("File too large (max 8MB). Choose a smaller photo.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageType(buffer);
  if (!sniffed) throw new Error("File content doesn't match a supported image format (jpg/png/webp/gif/avif).");

  let stored: { buffer: Buffer; ext: string };
  try {
    stored = await toStoredImage(buffer, sniffed.ext);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("GIF")) throw error;
    throw new Error("Could not process this image. Use a JPG or PNG photo.");
  }

  if (process.env.STORAGE_PROVIDER === "cloudinary") {
    const type = stored.ext === "webp" ? "image/webp" : sniffed.mime;
    const compressed = new File([new Uint8Array(stored.buffer)], `upload.${stored.ext}`, { type });
    return uploadToCloudinary(compressed, folder);
  }
  return uploadLocal(stored.buffer, stored.ext, folder);
}

async function uploadLocal(buffer: Buffer, ext: string, folder: string): Promise<UploadResult> {
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "");
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", safeFolder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return { url: `/uploads/${safeFolder}/${filename}`, provider: "local" };
}

async function uploadToCloudinary(file: File, folder: string): Promise<UploadResult> {
  // Cloudinary provider: requires CLOUDINARY_* env vars. Uses signed upload via their REST API.
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary env vars not configured; falling back is not possible at runtime.");

  const timestamp = Math.floor(Date.now() / 1000);
  const cryptoMod = await import("crypto");
  const toSign = `folder=bias-collection/${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = cryptoMod.createHash("sha1").update(toSign).digest("hex");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", `bias-collection/${folder}`);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary upload failed.");
  const json = await res.json();
  return { url: json.secure_url as string, provider: "cloudinary" };
}
