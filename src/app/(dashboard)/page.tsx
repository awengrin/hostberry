"use client";

import { Globe, Server, HardDrive, Mail } from "lucide-react";
import { useDomainList, useHostedDomains } from "@/hooks/use-domains";
import { useHostingPlans } from "@/hooks/use-hosting";
import Link from "next/link";

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors hover:border-[var(--primary)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const domains = useDomainList();
  const hosted = useHostedDomains();
  const plans = useHostingPlans();

  const domainCount = Array.isArray(domains.data?.data)
    ? domains.data.data.length
    : 0;
  const hostedCount = Array.isArray(hosted.data?.data)
    ? hosted.data.data.length
    : 0;
  const planCount = Array.isArray(plans.data?.data)
    ? plans.data.data.length
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Vitajte v HostBerry</h2>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Prehľad vašich služieb
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Globe}
          label="Registrované domény"
          value={domains.isLoading ? "..." : domainCount}
          href="/domains"
        />
        <StatCard
          icon={Server}
          label="Hostované domény"
          value={hosted.isLoading ? "..." : hostedCount}
          href="/domains"
        />
        <StatCard
          icon={HardDrive}
          label="Hosting plány"
          value={plans.isLoading ? "..." : planCount}
          href="/hosting"
        />
        <StatCard
          icon={Mail}
          label="Rýchle akcie"
          value="+"
          href="/domains/register"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent domains */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="font-semibold">Posledné domény</h3>
          <div className="mt-4 space-y-3">
            {domains.isLoading ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                Načítavam...
              </p>
            ) : Array.isArray(domains.data?.data) &&
              domains.data.data.length > 0 ? (
              domains.data.data.slice(0, 5).map(
                (
                  d: { name?: string; status?: string },
                  i: number
                ) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-[var(--muted)] px-4 py-2"
                  >
                    <span className="text-sm font-medium">
                      {d.name ?? "N/A"}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {d.status ?? ""}
                    </span>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">
                Žiadne domény
              </p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="font-semibold">Rýchle akcie</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/domains/register"
              className="rounded-lg border border-[var(--border)] p-4 text-center text-sm transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
            >
              <Globe className="mx-auto h-8 w-8 text-[var(--primary)]" />
              <span className="mt-2 block font-medium">
                Registrovať doménu
              </span>
            </Link>
            <Link
              href="/domains/transfer"
              className="rounded-lg border border-[var(--border)] p-4 text-center text-sm transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
            >
              <Globe className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
              <span className="mt-2 block font-medium">
                Transfer domény
              </span>
            </Link>
            <Link
              href="/hosting"
              className="rounded-lg border border-[var(--border)] p-4 text-center text-sm transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
            >
              <Server className="mx-auto h-8 w-8 text-[var(--primary)]" />
              <span className="mt-2 block font-medium">Hosting plány</span>
            </Link>
            <Link
              href="/vps"
              className="rounded-lg border border-[var(--border)] p-4 text-center text-sm transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
            >
              <HardDrive className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
              <span className="mt-2 block font-medium">VPS</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
