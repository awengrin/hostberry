import { apiRequest } from "./client";

export const subdomainsApi = {
  list: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/subdomains`, { token }),

  create: (domain: string, data: { name: string; document_root?: string }, token?: string) =>
    apiRequest(`/domain/${domain}/subdomains`, { method: "POST", body: data, token }),

  destroy: (domain: string, subdomainId: number, token?: string) =>
    apiRequest(`/domain/${domain}/subdomains/${subdomainId}`, { method: "DELETE", token }),
};
