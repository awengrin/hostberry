import { apiRequest } from "./client";

export const dbApi = {
  list: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/db`, { token }),

  create: (domain: string, data: { name: string; password?: string }, token?: string) =>
    apiRequest(`/domain/${domain}/db`, { method: "POST", body: data, token }),

  destroy: (domain: string, dbId: number, token?: string) =>
    apiRequest(`/domain/${domain}/db/${dbId}`, { method: "DELETE", token }),
};
