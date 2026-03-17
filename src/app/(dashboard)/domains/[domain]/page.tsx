"use client";

import { useParams } from "next/navigation";
import { useDomainRenew, usePruneCache } from "@/hooks/use-domains";
import { useDnsRecords, useCreateDnsRecord, useDeleteDnsRecord } from "@/hooks/use-dns";
import { useEmailUsers, useCreateEmailUser, useDeleteEmailUser } from "@/hooks/use-dns";
import { useDatabases, useCreateDatabase, useDeleteDatabase } from "@/hooks/use-dns";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  RefreshCw,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react";

function DnsSection({ domain }: { domain: string }) {
  const { data, isLoading } = useDnsRecords(domain);
  const createMutation = useCreateDnsRecord(domain);
  const deleteMutation = useDeleteDnsRecord(domain);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "A" as const, name: "", content: "", ttl: 3600 });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const records = Array.isArray(data?.data) ? data.data : [];

  const columns = [
    { key: "type", header: "Typ" },
    { key: "name", header: "Názov" },
    { key: "content", header: "Hodnota" },
    { key: "ttl", header: "TTL" },
    {
      key: "actions",
      header: "",
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">DNS záznamy</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs text-[var(--primary-foreground)]"
        >
          <Plus className="h-3 w-3" /> Pridať
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(form, { onSuccess: () => setShowForm(false) });
          }}
          className="grid grid-cols-4 gap-2 rounded-lg bg-[var(--muted)] p-4"
        >
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "A" })}
            className="rounded border border-[var(--input)] bg-[var(--background)] px-2 py-1.5 text-sm"
          >
            {["A", "AAAA", "CNAME", "MX", "TXT", "SRV", "NS"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            placeholder="Názov"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded border border-[var(--input)] bg-[var(--background)] px-2 py-1.5 text-sm"
            required
          />
          <input
            placeholder="Hodnota"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="rounded border border-[var(--input)] bg-[var(--background)] px-2 py-1.5 text-sm"
            required
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-[var(--primary)] text-sm text-[var(--primary-foreground)] disabled:opacity-50"
          >
            {createMutation.isPending ? "..." : "Pridať"}
          </button>
        </form>
      )}

      <DataTable columns={columns} data={records} isLoading={isLoading} emptyMessage="Žiadne DNS záznamy" />

      <ConfirmDialog
        open={deleteId !== null}
        title="Zmazať DNS záznam"
        message="Naozaj chcete zmazať tento DNS záznam?"
        confirmLabel="Zmazať"
        destructive
        onConfirm={() => { if (deleteId) { deleteMutation.mutate(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function EmailSection({ domain }: { domain: string }) {
  const { data, isLoading } = useEmailUsers(domain);
  const createMutation = useCreateEmailUser(domain);
  const deleteMutation = useDeleteEmailUser(domain);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const users = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Email účty</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs text-[var(--primary-foreground)]"
        >
          <Plus className="h-3 w-3" /> Pridať
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(form, { onSuccess: () => { setShowForm(false); setForm({ username: "", password: "" }); } });
          }}
          className="flex gap-2 rounded-lg bg-[var(--muted)] p-4"
        >
          <input
            placeholder="Meno (pred @)"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="flex-1 rounded border border-[var(--input)] bg-[var(--background)] px-2 py-1.5 text-sm"
            required
          />
          <input
            placeholder="Heslo"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="flex-1 rounded border border-[var(--input)] bg-[var(--background)] px-2 py-1.5 text-sm"
            required
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-[var(--primary)] px-4 text-sm text-[var(--primary-foreground)] disabled:opacity-50"
          >
            Pridať
          </button>
        </form>
      )}

      <DataTable
        columns={[
          { key: "email", header: "Email" },
          { key: "username", header: "Meno" },
          {
            key: "actions",
            header: "",
            render: (item: Record<string, unknown>) => (
              <button
                onClick={() => deleteMutation.mutate(item.id as number)}
                className="text-[var(--destructive)] hover:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        data={users}
        isLoading={isLoading}
        emptyMessage="Žiadne email účty"
      />
    </div>
  );
}

function DatabaseSection({ domain }: { domain: string }) {
  const { data, isLoading } = useDatabases(domain);
  const createMutation = useCreateDatabase(domain);
  const deleteMutation = useDeleteDatabase(domain);
  const [showForm, setShowForm] = useState(false);
  const [dbName, setDbName] = useState("");

  const databases = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Databázy</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs text-[var(--primary-foreground)]"
        >
          <Plus className="h-3 w-3" /> Pridať
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({ name: dbName }, { onSuccess: () => { setShowForm(false); setDbName(""); } });
          }}
          className="flex gap-2 rounded-lg bg-[var(--muted)] p-4"
        >
          <input
            placeholder="Názov databázy"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
            className="flex-1 rounded border border-[var(--input)] bg-[var(--background)] px-2 py-1.5 text-sm"
            required
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-[var(--primary)] px-4 text-sm text-[var(--primary-foreground)] disabled:opacity-50"
          >
            Vytvoriť
          </button>
        </form>
      )}

      <DataTable
        columns={[
          { key: "name", header: "Názov" },
          { key: "type", header: "Typ" },
          { key: "size", header: "Veľkosť" },
          {
            key: "actions",
            header: "",
            render: (item: Record<string, unknown>) => (
              <button
                onClick={() => deleteMutation.mutate(item.id as number)}
                className="text-[var(--destructive)] hover:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        data={databases}
        isLoading={isLoading}
        emptyMessage="Žiadne databázy"
      />
    </div>
  );
}

export default function DomainDetailPage() {
  const params = useParams();
  const domain = params.domain as string;
  const renewMutation = useDomainRenew();
  const cacheMutation = usePruneCache();
  const [activeTab, setActiveTab] = useState<"dns" | "email" | "db">("dns");

  const tabs = [
    { key: "dns" as const, label: "DNS" },
    { key: "email" as const, label: "Email" },
    { key: "db" as const, label: "Databázy" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Link href="/domains" className="hover:text-[var(--foreground)]">
          Domény
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--foreground)]">{domain}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-[var(--primary)]" />
          <h2 className="text-2xl font-bold">{domain}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => cacheMutation.mutate(domain)}
            disabled={cacheMutation.isPending}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--accent)] disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            {cacheMutation.isPending ? "..." : "Prečistiť cache"}
          </button>
          <button
            onClick={() => renewMutation.mutate(domain)}
            disabled={renewMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            {renewMutation.isPending ? "..." : "Obnoviť doménu"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {activeTab === "dns" && <DnsSection domain={domain} />}
        {activeTab === "email" && <EmailSection domain={domain} />}
        {activeTab === "db" && <DatabaseSection domain={domain} />}
      </div>
    </div>
  );
}
