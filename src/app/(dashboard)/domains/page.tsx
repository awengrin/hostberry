"use client";

import { useState } from "react";
import { useDomainList, useDomainDestroy } from "@/hooks/use-domains";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

export default function DomainsPage() {
  const { data, isLoading } = useDomainList();
  const destroyMutation = useDomainDestroy();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  const domains = Array.isArray(data?.data) ? data.data : [];

  const columns = [
    { key: "name", header: "Doména" },
    {
      key: "status",
      header: "Stav",
      render: (item: Record<string, unknown>) => (
        <StatusBadge status={String(item.status || "unknown")} />
      ),
    },
    { key: "expiration", header: "Expirácia" },
    {
      key: "actions",
      header: "Akcie",
      render: (item: Record<string, unknown>) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/domains/${item.name || item.id}`);
            }}
            className="rounded px-2 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10"
          >
            Detail
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(item.id as number);
            }}
            className="rounded px-2 py-1 text-xs text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
          >
            Zmazať
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Registrované domény</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Správa vašich registrovaných domén
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/domains/register"
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Registrovať
          </Link>
          <Link
            href="/domains/transfer"
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--accent)]"
          >
            <Search className="h-4 w-4" />
            Transfer
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={domains}
        isLoading={isLoading}
        emptyMessage="Nemáte žiadne registrované domény"
        onRowClick={(item) =>
          router.push(`/domains/${item.name || item.id}`)
        }
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Zmazať doménu"
        message="Naozaj chcete zmazať túto doménu? Táto akcia je nevratná."
        confirmLabel="Zmazať"
        destructive
        onConfirm={() => {
          if (deleteId) {
            destroyMutation.mutate(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
