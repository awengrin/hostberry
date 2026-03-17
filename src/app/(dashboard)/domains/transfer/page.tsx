"use client";

import { useState } from "react";
import { useDomainTransfer } from "@/hooks/use-domains";

export default function DomainTransferPage() {
  const [domain, setDomain] = useState("");
  const [authCode, setAuthCode] = useState("");
  const transferMutation = useDomainTransfer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain && authCode) {
      transferMutation.mutate({ domain, auth_code: authCode });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Transfer domény</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Preneste existujúcu doménu od iného registrátora
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Doména</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.sk"
              required
              className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm outline-none focus:border-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Autorizačný kód (EPP)
            </label>
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="AUTH-CODE-123"
              required
              className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm outline-none focus:border-[var(--ring)]"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Autorizačný kód získate od aktuálneho registrátora
            </p>
          </div>
          <button
            type="submit"
            disabled={transferMutation.isPending || !domain || !authCode}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            {transferMutation.isPending
              ? "Prenášam..."
              : "Preniesť doménu"}
          </button>
          {transferMutation.isSuccess && (
            <p className="text-sm text-[var(--success)]">
              Transfer bol úspešne iniciovaný!
            </p>
          )}
          {transferMutation.isError && (
            <p className="text-sm text-[var(--destructive)]">
              {transferMutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
