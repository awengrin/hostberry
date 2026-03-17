"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Prihlásenie zlyhalo");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neočakávaná chyba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-2xl font-bold">
            HB
          </div>
          <h1 className="mt-4 text-2xl font-bold">HostBerry</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Zadajte váš HostCreators API token
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium mb-1.5"
            >
              API Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Váš Bearer token z HostCreators"
              required
              className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--destructive)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Overujem..." : "Prihlásiť sa"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--muted-foreground)]">
          Token získate v administrácii{" "}
          <a
            href="https://www.hostcreators.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline"
          >
            HostCreators.sk
          </a>
        </p>
      </div>
    </div>
  );
}
