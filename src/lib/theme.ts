export const DEFAULT_THEME_COLOR = "#3c2416";

export const THEME_PRESETS = [
  { name: "Dates brown", value: "#3c2416" },
  { name: "Forest", value: "#1f3d2b" },
  { name: "Maroon", value: "#6b2430" },
  { name: "Navy", value: "#1c2e4a" },
  { name: "Black", value: "#161616" },
];

export function normalizeThemeColor(input?: string | null): string {
  const value = (input ?? "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : DEFAULT_THEME_COLOR;
}

export function rgbChannels(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function darkenHex(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const factor = 1 - amount;
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((channel) =>
    Math.max(0, Math.min(255, Math.round(channel * factor))).toString(16).padStart(2, "0"),
  );
  return `#${channels.join("")}`;
}

/** CSS variables consumed by the `brand` and `branddark` Tailwind colors. */
export function brandStyle(input?: string | null): Record<"--brand" | "--brand-dark", string> {
  const color = normalizeThemeColor(input);
  return {
    "--brand": rgbChannels(color),
    "--brand-dark": rgbChannels(darkenHex(color, 0.16)),
  };
}

export function sanitizeLogoUrl(input?: string | null): string {
  const value = (input ?? "").trim();
  if (!value) return "";
  if (value.startsWith("/uploads/") || value.startsWith("/images/")) {
    if (value.includes("..") || value.includes("\\") || /[\s"'<>]/.test(value)) return "";
    return value;
  }
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return "";
  }
  return "";
}
