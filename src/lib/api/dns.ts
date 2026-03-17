import { apiRequest } from "./client";
import type { DnsRecordCreate } from "./types";

export const dnsApi = {
  list: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/dns`, { token }),

  create: (domain: string, data: DnsRecordCreate, token?: string) =>
    apiRequest(`/domain/${domain}/dns`, { method: "POST", body: data, token }),

  update: (domain: string, recordId: number, data: Partial<DnsRecordCreate>, token?: string) =>
    apiRequest(`/domain/${domain}/dns/${recordId}`, { method: "PATCH", body: data, token }),

  destroy: (domain: string, recordId: number, token?: string) =>
    apiRequest(`/domain/${domain}/dns/${recordId}`, { method: "DELETE", token }),
};
