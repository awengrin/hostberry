import { apiRequest } from "./client";

export const gitDeployApi = {
  get: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/git-deploy`, { token }),

  configure: (domain: string, data: { repository: string; branch?: string }, token?: string) =>
    apiRequest(`/domain/${domain}/git-deploy`, { method: "POST", body: data, token }),

  destroy: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/git-deploy`, { method: "DELETE", token }),
};
