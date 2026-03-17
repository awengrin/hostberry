import { apiRequest } from "./client";
import type { EmailUserCreate } from "./types";

export const emailApi = {
  list: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/email-users`, { token }),

  create: (domain: string, data: EmailUserCreate, token?: string) =>
    apiRequest(`/domain/${domain}/email-users`, { method: "POST", body: data, token }),

  destroy: (domain: string, userId: number, token?: string) =>
    apiRequest(`/domain/${domain}/email-users/${userId}`, { method: "DELETE", token }),

  // Virtual Mailbox
  listMailboxes: (domain: string, token?: string) =>
    apiRequest(`/domain/${domain}/virtual-mailbox`, { token }),

  createMailbox: (domain: string, data: { email: string; password: string }, token?: string) =>
    apiRequest(`/domain/${domain}/virtual-mailbox`, { method: "POST", body: data, token }),

  destroyMailbox: (domain: string, mailboxId: number, token?: string) =>
    apiRequest(`/domain/${domain}/virtual-mailbox/${mailboxId}`, { method: "DELETE", token }),
};
