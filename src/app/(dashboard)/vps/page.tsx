"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

export default function VpsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["vps"],
    queryFn: async () => {
      const res = await fetch("/api/vps");
      if (!res.ok) throw new Error("Chyba pri načítaní VPS");
      return res.json();
    },
  });

  const vpsList = Array.isArray(data?.data) ? data.data : [];

  const columns = [
    { key: "name", header: "Názov" },
    { key: "ip", header: "IP adresa" },
    { key: "os", header: "OS" },
    { key: "ram", header: "RAM (MB)" },
    { key: "cpu", header: "CPU" },
    { key: "storage", header: "Disk (GB)" },
    {
      key: "status",
      header: "Stav",
      render: (item: Record<string, unknown>) => (
        <StatusBadge status={String(item.status || "unknown")} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Virtuálne servery (VPS)</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Prehľad vašich VPS
        </p>
      </div>

      <DataTable
        columns={columns}
        data={vpsList}
        isLoading={isLoading}
        emptyMessage="Nemáte žiadne VPS"
      />
    </div>
  );
}
