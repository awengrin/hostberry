import { apiRequest } from "./client";

export const domainsApi = {
  // Domain Registration
  check: (domain: string, token?: string) =>
    apiRequest("/domain/check", { params: { q: domain }, token }),

  create: (token?: string) =>
    apiRequest("/domain/create", { token }),

  register: (data: { domain: string; period?: number }, token?: string) =>
    apiRequest("/domain/store", { method: "POST", body: { ...data, type: "register" }, token }),

  transfer: (data: { domain: string; auth_code: string }, token?: string) =>
    apiRequest("/domain/store", { method: "POST", body: { ...data, type: "transfer" }, token }),

  list: (token?: string) =>
    apiRequest("/domain/list", { token }),

  destroy: (id: number | string, token?: string) =>
    apiRequest(`/domain/${id}`, { method: "DELETE", token }),

  // Hosted Domains
  listHosted: (token?: string) =>
    apiRequest("/domains", { token }),

  pruneCache: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/prune-http-cache`, { token }),

  renew: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/renew`, { method: "PATCH", token }),

  // Verification
  verify: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/verification`, { token }),
};
