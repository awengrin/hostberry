import { apiRequest } from "./client";

export const vpsApi = {
  list: (token?: string) =>
    apiRequest("/vps", { token }),

  get: (id: number | string, token?: string) =>
    apiRequest(`/vps/${id}`, { token }),

  create: (data: Record<string, unknown>, token?: string) =>
    apiRequest("/vps", { method: "POST", body: data, token }),

  destroy: (id: number | string, token?: string) =>
    apiRequest(`/vps/${id}`, { method: "DELETE", token }),
};
