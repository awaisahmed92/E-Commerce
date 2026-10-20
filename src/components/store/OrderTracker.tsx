"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/primitives";
import { formatMoney } from "@/lib/utils";

const FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];

type TrackedOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  placedAt: string;
  trackingNumber: string | null;
  shippingMethodName: string | null;
  total: number | string;
  items: Array<{ id: string; productName: string; variantName: string | null; image: string | null; quantity: number }>;
  history: Array<{ id: string; status: string; createdAt: string }>;
};

export default function OrderTracker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: form.get("orderNumber"),
          identifier: form.get("identifier"),
        }),
      });
      const json = await response.json();
      if (!json.ok) {
        setError(json.error || "We could not find that order.");
      } else {
        setOrder(json.data.order);
      }
    } catch {
      setError("Tracking is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeIndex = order ? FLOW.indexOf(order.status) : -1;

  return (
    <div>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label>
          <span className="label">Order number</span>
          <input name="orderNumber" required className="input h-12" placeholder="KDH-2026-10001" />
        </label>
        <label>
          <span className="label">Email or mobile</span>
          <input name="identifier" required className="input h-12" placeholder="Used at checkout" />
        </label>
        <button className="btn-primary h-12 min-w-40" disabled={loading}>
          {loading ? <><Spinner /> Checking</> : "Track order →"}
        </button>
      </form>

      {error && (
        <p className="mt-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      {order && (
        <section className="mt-8 border border-night/10 bg-white p-6 sm:p-8" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-mist">Order found</p>
              <h2 className="mt-2 font-display text-3xl">{order.orderNumber}</h2>
              <p className="mt-1 text-sm text-night/50">
                Placed {new Date(order.placedAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex bg-sand px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-clay">{order.status}</span>
              <p className="mt-2 font-semibold">{formatMoney(Number(order.total))}</p>
            </div>
          </div>

          {order.status === "CANCELLED" ? (
            <div className="mt-7 bg-rose-50 p-5 text-sm text-rose-800">This order was cancelled. Contact us if you need help.</div>
          ) : (
            <div className="mt-8 overflow-x-auto">
              <div className="flex min-w-[620px] items-start">
                {FLOW.map((status, index) => (
                  <div key={status} className="relative flex flex-1 flex-col items-center">
                    {index > 0 && <span className={`absolute right-1/2 top-3 h-px w-full ${index <= activeIndex ? "bg-leaf" : "bg-line"}`} />}
                    <span className={`relative z-10 grid h-7 w-7 place-items-center rounded-full border text-[10px] font-bold ${index <= activeIndex ? "border-leaf bg-leaf text-white" : "border-line bg-white text-mist"}`}>
                      {index < activeIndex ? "✓" : index + 1}
                    </span>
                    <span className={`mt-2 text-[9px] font-bold uppercase tracking-[0.1em] ${index <= activeIndex ? "text-night" : "text-mist"}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.trackingNumber && (
            <p className="mt-7 border-l-2 border-amber bg-sand/50 px-4 py-3 text-sm">
              Courier tracking number: <strong>{order.trackingNumber}</strong>
            </p>
          )}

          <div className="mt-8 grid gap-8 border-t border-line pt-6 md:grid-cols-2">
            <div>
              <h3 className="font-display text-xl">Items</h3>
              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    <span className="h-12 w-10 overflow-hidden bg-sand">
                      {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                    </span>
                    <span className="flex-1">
                      <strong className="block">{item.productName}</strong>
                      <span className="text-night/50">{item.variantName || "Standard pack"} · Qty {item.quantity}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl">Latest updates</h3>
              <ol className="mt-4 space-y-3">
                {order.history.slice().reverse().slice(0, 4).map((entry) => (
                  <li key={entry.id} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-clay" />
                    <span>
                      <strong className="block">{entry.status}</strong>
                      <span className="text-xs text-night/45">{new Date(entry.createdAt).toLocaleString("en-PK")}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
