"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [newToken, setNewToken] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleUpdateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: newToken }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setNewToken("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Nastavenia</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Konfigurácia aplikácie
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="font-medium">API Token</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Aktualizujte váš HostCreators API token
        </p>
        <form onSubmit={handleUpdateToken} className="mt-4 space-y-4">
          <input
            type="password"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder="Nový API token"
            required
            className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm outline-none focus:border-[var(--ring)]"
          />
          <button
            type="submit"
            disabled={status === "saving" || !newToken}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            {status === "saving" ? "Ukladám..." : "Uložiť token"}
          </button>
          {status === "success" && (
            <p className="text-sm text-[var(--success)]">Token bol úspešne aktualizovaný!</p>
          )}
          {status === "error" && (
            <p className="text-sm text-[var(--destructive)]">Neplatný token</p>
          )}
        </form>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="font-medium">O aplikácii</h3>
        <div className="mt-4 space-y-2 text-sm text-[var(--muted-foreground)]">
          <p><strong>HostBerry</strong> v1.0.0</p>
          <p>Správa web hostingu a domén</p>
          <p>
            Prepojené na{" "}
            <a
              href="https://www.hostcreators.sk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline"
            >
              HostCreators API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
