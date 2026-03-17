import { apiRequest } from "./client";

export const hostingApi = {
  createForm: (token?: string) =>
    apiRequest("/plan/create", { token }),

  store: (data: { name: string; storage?: number }, token?: string) =>
    apiRequest("/plan/store", { method: "POST", body: data, token }),

  list: (token?: string) =>
    apiRequest("/plan/list", { token }),

  destroy: (id: number | string, token?: string) =>
    apiRequest(`/plan/${id}`, { method: "DELETE", token }),
};
