"use client";
import { useState } from "react";
import { Spinner } from "@/components/ui/primitives";

const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const MAX_EDGE = 1600;

/** Shrink a phone photo in the browser so the server never receives the original file. */
async function prepareUpload(file: File): Promise<File> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("This photo is too large (max 12MB). Choose a smaller one.");
  }
  if (file.type === "image/gif") {
    if (file.size > 1_500_000) throw new Error("GIF is too large (max 1.5MB).");
    return file;
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Could not read this image. Use a JPG or PNG photo.");

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.75);
  });
  const output = blob ?? (await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.75)));
  if (!output) throw new Error("Could not compress this image. Try a smaller JPG.");
  if (output.size > 1_500_000) throw new Error("Image is still too large after compression. Try a smaller photo.");
  if (output.size >= file.size && file.size <= 1_500_000) return file;

  const type = output.type || "image/jpeg";
  const ext = type === "image/webp" ? "webp" : "jpg";
  return new File([output], `upload.${ext}`, { type });
}

export default function ImagePicker({
  value,
  onChange,
  folder = "misc",
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const prepared = await prepareUpload(file);
      const fd = new FormData();
      fd.append("file", prepared);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      onChange(json.data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      <div className="flex items-center gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden border border-line bg-sand text-[9px] uppercase text-ink/30">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : "—"}
        </div>
        <div className="flex-1">
          <input
            className="admin-input"
            placeholder="https://… or /images/…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="mt-1.5 flex items-center gap-3">
            <label className="cursor-pointer text-[11px] font-bold uppercase tracking-[0.12em] text-claydark hover:underline">
              {uploading ? <Spinner className="h-3 w-3" /> : "Upload file"}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            {error && <span className="text-xs text-rose-600">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
