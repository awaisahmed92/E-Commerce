"use client";
import { useState } from "react";
import { Spinner } from "@/components/ui/primitives";

export default function ContactForm({ wholesale = false }: { wholesale?: boolean }) {
  const [state, setState] = useState<{ loading: boolean; message?: string; error?: string }>({ loading: false });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState({ loading: true });
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        company: fd.get("company"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        intent: fd.get("intent"),
        product: fd.get("product"),
        message: fd.get("message"),
      }),
    });
    const json = await res.json();
    if (json.ok) {
      setState({ loading: false, message: json.data.message });
      e.currentTarget.reset();
    } else setState({ loading: false, error: json.error });
  };

  if (state.message)
    return <div className="border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">{state.message}</div>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input name="name" required className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Phone / WhatsApp</label>
          <input name="phone" type="tel" className="input" placeholder="+92 3…" />
        </div>
        <div>
          <label className="label">Company</label>
          <input name="company" className="input" placeholder={wholesale ? "Company name" : "Optional"} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">I need</label>
          <select name="intent" className="select" defaultValue={wholesale ? "quote" : "question"}>
            <option value="question">Product or order help</option>
            <option value="sample">A product sample</option>
            <option value="quote">A wholesale quote</option>
            <option value="private-label">Private label packing</option>
            <option value="visit">A visit to the house</option>
          </select>
        </div>
        <div>
          <label className="label">Fruit / Product</label>
          <input name="product" className="input" placeholder="Aseel Select, paste, gift box…" />
        </div>
      </div>
      <div>
        <label className="label">Message</label>
        <textarea
          name="message"
          required
          className="textarea min-h-[140px]"
          placeholder={wholesale ? "Grade, pack size, quantity, destination and required date." : "How can we help?"}
        />
      </div>
      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <button disabled={state.loading} className="btn-primary">
        {state.loading ? <Spinner /> : wholesale ? "Request a Quote" : "Send Message"}
      </button>
    </form>
  );
}
