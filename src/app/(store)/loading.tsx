import { BrandLogo } from "@/components/brand-logo";
import { getAllSettings } from "@/services/settings.service";

export default async function StoreLoading() {
  const settings = await getAllSettings();
  return (
    <div className="grid min-h-[55vh] place-items-center bg-paper" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center">
        <span className="loader-pulse"><BrandLogo compact logoUrl={settings.logoUrl} /></span>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-mist">Preparing your page</p>
        <span className="mt-4 h-px w-32 overflow-hidden bg-line">
          <span className="loader-line block h-full w-1/2 bg-leaf" />
        </span>
      </div>
    </div>
  );
}
