"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export function useDomainList() {
  return useQuery({
    queryKey: ["domains"],
    queryFn: () => fetchApi("/api/domains"),
  });
}

export function useHostedDomains() {
  return useQuery({
    queryKey: ["domains", "hosted"],
    queryFn: () => fetchApi("/api/domains?type=hosted"),
  });
}

export function useDomainCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domain: string) =>
      fetchApi("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check", domain }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}

export function useDomainRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { domain: string; period?: number }) =>
      fetchApi("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", ...data }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}

export function useDomainTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { domain: string; auth_code: string }) =>
      fetchApi("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "transfer", ...data }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}

export function useDomainDestroy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) =>
      fetchApi(`/api/domains?id=${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}

export function useDomainRenew() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domain: string) =>
      fetchApi("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "renew", domain }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}

export function usePruneCache() {
  return useMutation({
    mutationFn: (domain: string) =>
      fetchApi("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "prune-cache", domain }),
      }),
  });
}
