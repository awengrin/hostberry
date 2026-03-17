"use client";

import { useState } from "react";
import { useHostingPlans, useCreatePlan, useDestroyPlan } from "@/hooks/use-hosting";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Plus, Trash2 } from "lucide-react";

export default function HostingPage() {
  const { data, isLoading } = useHostingPlans();
  const createMutation = useCreatePlan();
  const destroyMutation = useDestroyPlan();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", storage: 1 });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const plans = Array.isArray(data?.data) ? data.data : [];

  const columns = [
    { key: "name", header: "Názov" },
    { key: "storage", header: "Úložisko (GB)" },
    { key: "price", header: "Cena" },
    {
      key: "status",
      header: "Stav",
      render: (item: Record<string, unknown>) => (
        <StatusBadge status={String(item.status || "active")} />
      ),
    },
    {
      key: "actions",
      header: "Akcie",
      render: (item: Record<string, unknown>) => (
        <button
          onClick={() => setDeleteId(item.id as number)}
          className="text-[var(--destructive)] hover:opacity-70"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Hosting plány</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Správa vašich hosting plánov
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nový plán
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="font-medium">Nový hosting plán</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(form, {
                onSuccess: () => {
                  setShowForm(false);
                  setForm({ name: "", storage: 1 });
                },
              });
            }}
            className="mt-4 grid gap-4 sm:grid-cols-3"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Názov</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Môj plán"
                required
                className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm outline-none focus:border-[var(--ring)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Úložisko (GB)
              </label>
              <input
                type="number"
                value={form.storage}
                onChange={(e) =>
                  setForm({ ...form, storage: Number(e.target.value) })
                }
                min={1}
                required
                className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm outline-none focus:border-[var(--ring)]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
              >
                {createMutation.isPending ? "Vytváram..." : "Vytvoriť"}
              </button>
            </div>
          </form>
          {createMutation.isError && (
            <p className="mt-2 text-sm text-[var(--destructive)]">
              {createMutation.error.message}
            </p>
          )}
        </div>
      )}

      <DataTable
        columns={columns}
        data={plans}
        isLoading={isLoading}
        emptyMessage="Nemáte žiadne hosting plány"
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Zmazať plán"
        message="Naozaj chcete zmazať tento hosting plán?"
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
