"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImagePicker from "@/components/admin/ImagePicker";
import { Spinner } from "@/components/ui/primitives";
import { DEFAULT_THEME_COLOR, THEME_PRESETS, normalizeThemeColor } from "@/lib/theme";

const FIELDS: { key: string; label: string; hint?: string; type?: string }[] = [
  { key: "storeName", label: "Store Name" },
  { key: "storeEmail", label: "Store Email" },
  { key: "storePhone", label: "Store Phone" },
  { key: "storeAddress", label: "Store Address" },
  { key: "taxRatePercent", label: "Tax Rate %", hint: "Applied on discounted subtotal at checkout", type: "number" },
  { key: "announcement", label: "Announcement Bar Text", hint: "Shown at the very top of the storefront" },
  { key: "facebookUrl", label: "Facebook URL", hint: "Icon in the header and footer. Leave empty to hide it." },
  { key: "instagramUrl", label: "Instagram URL", hint: "Icon in the header and footer. Leave empty to hide it." },
  { key: "linkedinUrl", label: "LinkedIn URL", hint: "Icon in the header and footer. Leave empty to hide it." },
  { key: "whatsappNumber", label: "WhatsApp Number" },
];

const MARGIN_TYPE_OPTIONS = [
  { value: "percent", label: "Percentage of cost" },
  { value: "flat", label: "Flat amount (Rs.)" },
];

export default function SettingsClient({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState(settings);
  const [state, setState] = useState<{ saving: boolean; message?: string; error?: string }>({ saving: false });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^#[0-9a-fA-F]{6}$/.test(values.themeColor ?? "")) {
      setState({ saving: false, error: "Brand color must be a hex color like #3c2416." });
      return;
    }
    setState({ saving: true });
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!json.ok) setState({ saving: false, error: json.error });
    else {
      setState({ saving: false, message: "Settings saved." });
      router.refresh();
      setTimeout(() => setState({ saving: false }), 2500);
    }
  };

  const themeColor = normalizeThemeColor(values.themeColor || DEFAULT_THEME_COLOR);

  return (
    <form onSubmit={save} className="max-w-2xl">
      <h1 className="mb-6 font-serif text-3xl">Store Settings</h1>

      <div className="admin-card space-y-5">
        <div>
          <h2 className="font-serif text-lg">Theme &amp; logo</h2>
          <p className="text-xs text-ink/40">
            The brand color is saved and used on the header bar, footer, logo badge, buttons, and the admin sidebar. Pick a dark color so the light text stays readable.
          </p>
        </div>

        <div>
          <label className="admin-label">Brand color</label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              aria-label="Brand color"
              className="h-11 w-14 cursor-pointer border border-line bg-white p-1"
              value={themeColor}
              onChange={(e) => setValues({ ...values, themeColor: e.target.value })}
            />
            <input
              className="admin-input max-w-[140px] font-mono uppercase"
              value={values.themeColor ?? DEFAULT_THEME_COLOR}
              onChange={(e) => setValues({ ...values, themeColor: e.target.value })}
              spellCheck={false}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setValues({ ...values, themeColor: preset.value })}
                className="inline-flex items-center gap-2 border border-line px-2.5 py-1.5 text-[11px] font-semibold"
              >
                <span className="h-3.5 w-3.5 border border-black/10" style={{ background: preset.value }} />
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden border border-line">
          <div className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-paper" style={{ background: themeColor }}>
            Header bar
          </div>
          <div className="flex items-center gap-3 bg-paper px-4 py-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-t-[1.35rem] rounded-b-lg" style={{ background: themeColor }}>
              {values.logoUrl ? <img src={values.logoUrl} alt="" className="h-9 w-9 object-contain" /> : <span className="text-[10px] text-paper">Icon</span>}
            </span>
            <span className="font-serif text-lg">Khairpur</span>
          </div>
          <div className="px-4 py-4 text-sm text-paper/85" style={{ background: themeColor }}>
            Footer uses this same color.
          </div>
        </div>

        <div>
          <ImagePicker
            label="Logo image"
            folder="brand"
            value={values.logoUrl ?? ""}
            onChange={(url) => setValues({ ...values, logoUrl: url })}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-ink/40">Square icon for the header and footer badge. Leave empty to keep the date icon.</p>
            {values.logoUrl ? (
              <button type="button" className="text-[11px] font-bold uppercase tracking-[0.12em] text-rose-700" onClick={() => setValues({ ...values, logoUrl: "" })}>
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="admin-card mt-6 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="admin-label">{f.label}</label>
            <input
              type={f.type ?? "text"}
              className="admin-input"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
            {f.hint && <p className="mt-1 text-xs text-ink/40">{f.hint}</p>}
          </div>
        ))}
      </div>

      <div className="admin-card mt-6 space-y-4">
        <div>
          <h2 className="font-serif text-lg">Pricing Defaults</h2>
          <p className="text-xs text-ink/40">
            The fallback margin used to suggest a selling price from a product&apos;s cost price, whenever the product and its category don&apos;t set their own margin.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Default Margin Type</label>
            <select
              className="admin-input"
              value={values.defaultMarginType ?? "percent"}
              onChange={(e) => setValues({ ...values, defaultMarginType: e.target.value })}
            >
              {MARGIN_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Default Margin Value</label>
            <input
              type="number"
              min="0"
              className="admin-input"
              value={values.defaultMarginValue ?? "0"}
              onChange={(e) => setValues({ ...values, defaultMarginValue: e.target.value })}
            />
            <p className="mt-1 text-xs text-ink/40">
              {values.defaultMarginType === "flat" ? "Rs. added on top of cost price." : "% added on top of cost price."}
            </p>
          </div>
        </div>
      </div>

      {state.error && <p className="mt-4 text-sm text-rose-600">{state.error}</p>}
      {state.message && <p className="mt-4 text-sm font-semibold text-emerald-700">{state.message}</p>}
      <button disabled={state.saving} className="admin-btn mt-6">{state.saving ? <Spinner /> : "Save Settings"}</button>
    </form>
  );
}
