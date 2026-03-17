import { apiRequest } from "./client";

export const ftpApi = {
  list: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/ftp-users`, { token }),

  create: (domain: string, data: { username: string; password: string; directory?: string }, token?: string) =>
    apiRequest(`/domain/${domain}/ftp-users`, { method: "POST", body: data, token }),

  destroy: (domain: string, userId: number, token?: string) =>
    apiRequest(`/domain/${domain}/ftp-users/${userId}`, { method: "DELETE", token }),
};
