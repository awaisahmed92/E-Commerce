import type { Metadata } from "next";
import OrderTracker from "@/components/store/OrderTracker";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the latest status of your Khairpur Dates House order.",
  robots: { index: false },
};

export default function TrackOrderPage() {
  return (
    <div className="bg-paper">
      <section className="container-x py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-leaf">Customer care</p>
            <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">Track your order</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-night/58">
              Enter the order number from your confirmation and the email address or mobile number used at checkout.
            </p>
          </div>
          <div className="mt-10 bg-sand/55 p-5 sm:p-8">
            <OrderTracker />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Order number", "Shown on your confirmation page and message."],
              ["Private lookup", "We match your email or mobile before showing details."],
              ["Need help?", "Contact the house if your order has not updated."],
            ].map(([title, body]) => (
              <div key={title} className="border-t border-night/12 pt-4">
                <h2 className="font-display text-xl">{title}</h2>
                <p className="mt-2 text-xs leading-5 text-night/50">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
