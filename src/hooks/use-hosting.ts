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

export function useHostingPlans() {
  return useQuery({
    queryKey: ["hosting-plans"],
    queryFn: () => fetchApi("/api/hosting"),
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; storage?: number }) =>
      fetchApi("/api/hosting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hosting-plans"] }),
  });
}

export function useDestroyPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) =>
      fetchApi(`/api/hosting?id=${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hosting-plans"] }),
  });
}
