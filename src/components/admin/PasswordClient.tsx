"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/primitives";

export default function PasswordClient({ email }: { email: string }) {
  const [state, setState] = useState<{ loading: boolean; message?: string; error?: string }>({ loading: false });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("newPassword") || "");
    const confirm = String(form.get("confirm") || "");
    if (newPassword !== confirm) {
      setState({ loading: false, error: "New passwords do not match." });
      return;
    }
    setState({ loading: true });
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword }),
    });
    const json = await res.json();
    if (json.ok) {
      setState({ loading: false, message: "Password updated." });
      e.currentTarget.reset();
    } else {
      setState({ loading: false, error: json.error || "Could not update the password." });
    }
  };

  return (
    <form onSubmit={submit} className="admin-card max-w-md space-y-4">
      <div>
        <h1 className="font-serif text-3xl">Change password</h1>
        <p className="mt-2 text-sm text-ink/60">Signed in as {email}</p>
      </div>
      <div>
        <label className="admin-label">Current password</label>
        <input name="currentPassword" type="password" required autoComplete="current-password" className="admin-input" />
      </div>
      <div>
        <label className="admin-label">New password</label>
        <input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className="admin-input" />
      </div>
      <div>
        <label className="admin-label">Confirm new password</label>
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className="admin-input" />
      </div>
      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-700">{state.message}</p>}
      <button disabled={state.loading} className="admin-btn">
        {state.loading ? <Spinner /> : "Update password"}
      </button>
    </form>
  );
}
