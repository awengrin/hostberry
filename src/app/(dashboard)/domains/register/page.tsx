"use client";

import { useState } from "react";
import { useDomainCheck, useDomainRegister } from "@/hooks/use-domains";
import { Search, Check, X } from "lucide-react";

export default function DomainRegisterPage() {
  const [searchDomain, setSearchDomain] = useState("");
  const [registerDomain, setRegisterDomain] = useState("");
  const [period, setPeriod] = useState(1);
  const checkMutation = useDomainCheck();
  const registerMutation = useDomainRegister();

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDomain) {
      checkMutation.mutate(searchDomain);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerDomain) {
      registerMutation.mutate({ domain: registerDomain, period });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Registrácia domény</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Najprv skontrolujte dostupnosť domény
        </p>
      </div>

      {/* Domain check */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="font-medium">Kontrola dostupnosti</h3>
        <form onSubmit={handleCheck} className="mt-4 flex gap-2">
          <input
            type="text"
            value={searchDomain}
            onChange={(e) => setSearchDomain(e.target.value)}
            placeholder="example.sk"
            className="flex-1 rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm outline-none focus:border-[var(--ring)]"
          />
          <button
            type="submit"
            disabled={checkMutation.isPending || !searchDomain}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {checkMutation.isPending ? "Kontrolujem..." : "Skontrolovať"}
          </button>
        </form>

        {checkMutation.data && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-[var(--muted)] p-4">
            {checkMutation.data.available ? (
              <>
                <Check className="h-5 w-5 text-[var(--success)]" />
                <div>
                  <p className="font-medium text-[var(--success)]">
                    Doména je dostupná!
                  </p>
                  {checkMutation.data.price && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Cena: {checkMutation.data.price} EUR/rok
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setRegisterDomain(searchDomain)}
                  className="ml-auto rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm text-[var(--primary-foreground)]"
                >
                  Registrovať
                </button>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-[var(--destructive)]" />
                <p className="font-medium text-[var(--destructive)]">
                  Doména nie je dostupná
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Registration form */}
      {registerDomain && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="font-medium">Registrácia: {registerDomain}</h3>
          <form onSubmit={handleRegister} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Doména</label>
              <input
                type="text"
                value={registerDomain}
                readOnly
                className="w-full rounded-lg border border-[var(--input)] bg-[var(--muted)] px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Obdobie (roky)
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm"
              >
                <option value={1}>1 rok</option>
                <option value={2}>2 roky</option>
                <option value={3}>3 roky</option>
                <option value={5}>5 rokov</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
            >
              {registerMutation.isPending
                ? "Registrujem..."
                : "Registrovať doménu"}
            </button>
            {registerMutation.isSuccess && (
              <p className="text-sm text-[var(--success)]">
                Doména bola úspešne zaregistrovaná!
              </p>
            )}
            {registerMutation.isError && (
              <p className="text-sm text-[var(--destructive)]">
                {registerMutation.error.message}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
