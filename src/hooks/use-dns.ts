"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DnsRecordCreate } from "@/lib/api/types";

async function fetchApi(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Neautorizovaný");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Chyba: ${res.status}`);
  }
  return res.json();
}

export function useDnsRecords(domain: string) {
  return useQuery({
    queryKey: ["dns", domain],
    queryFn: () => fetchApi(`/api/dns?domain=${domain}`),
    enabled: !!domain,
  });
}

export function useCreateDnsRecord(domain: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DnsRecordCreate) =>
      fetchApi("/api/dns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, ...data }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dns", domain] }),
  });
}

export function useDeleteDnsRecord(domain: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recordId: number) =>
      fetchApi(`/api/dns?domain=${domain}&recordId=${recordId}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dns", domain] }),
  });
}

// Email hooks
export function useEmailUsers(domain: string) {
  return useQuery({
    queryKey: ["email", domain],
    queryFn: () => fetchApi(`/api/email?domain=${domain}`),
    enabled: !!domain,
  });
}

export function useCreateEmailUser(domain: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { username: string; password: string; quota?: number }) =>
      fetchApi("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, ...data }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email", domain] }),
  });
}

export function useDeleteEmailUser(domain: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      fetchApi(`/api/email?domain=${domain}&userId=${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email", domain] }),
  });
}

// Database hooks
export function useDatabases(domain: string) {
  return useQuery({
    queryKey: ["db", domain],
    queryFn: () => fetchApi(`/api/db?domain=${domain}`),
    enabled: !!domain,
  });
}

export function useCreateDatabase(domain: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; password?: string }) =>
      fetchApi("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, ...data }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db", domain] }),
  });
}

export function useDeleteDatabase(domain: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dbId: number) =>
      fetchApi(`/api/db?domain=${domain}&dbId=${dbId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db", domain] }),
  });
}
