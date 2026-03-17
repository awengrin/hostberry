import { z } from "zod/v4";

// ── Auth ──
export const LoginSchema = z.object({
  token: z.string().min(1, "API token je povinný"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// ── Generic API response ──
export const ApiErrorSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

// ── Domain Registration ──
export const DomainCheckSchema = z.object({
  available: z.boolean().optional(),
  domain: z.string().optional(),
  price: z.number().optional(),
});

export const DomainSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  status: z.string().optional(),
  expiration: z.string().optional(),
  auto_renew: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const DomainListSchema = z.object({
  data: z.array(DomainSchema).optional(),
});

export const DomainRegisterSchema = z.object({
  domain: z.string().min(1, "Doména je povinná"),
  period: z.number().min(1).default(1),
});

export const DomainTransferSchema = z.object({
  domain: z.string().min(1, "Doména je povinná"),
  auth_code: z.string().min(1, "Auth kód je povinný"),
});

// ── Hosting Plans ──
export const HostingPlanSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  storage: z.number().optional(),
  price: z.number().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
});

export const HostingPlanListSchema = z.object({
  data: z.array(HostingPlanSchema).optional(),
});

export const PlanCreateSchema = z.object({
  name: z.string().min(1, "Názov plánu je povinný"),
  storage: z.number().min(1, "Úložisko je povinné"),
});

// ── Hosted Domains ──
export const HostedDomainSchema = z.object({
  id: z.number().optional(),
  domain: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  document_root: z.string().optional(),
  php_version: z.string().optional(),
  ssl: z.boolean().optional(),
  created_at: z.string().optional(),
});

export const HostedDomainListSchema = z.object({
  data: z.array(HostedDomainSchema).optional(),
});

// ── DNS Records ──
export const DnsRecordSchema = z.object({
  id: z.number().optional(),
  type: z.string(),
  name: z.string(),
  content: z.string(),
  ttl: z.number().optional(),
  priority: z.number().optional(),
});

export const DnsRecordListSchema = z.object({
  data: z.array(DnsRecordSchema).optional(),
});

export const DnsRecordCreateSchema = z.object({
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "SRV", "NS"]),
  name: z.string().min(1),
  content: z.string().min(1),
  ttl: z.number().default(3600),
  priority: z.number().optional(),
});

// ── Email Users ──
export const EmailUserSchema = z.object({
  id: z.number().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  quota: z.number().optional(),
  created_at: z.string().optional(),
});

export const EmailUserListSchema = z.object({
  data: z.array(EmailUserSchema).optional(),
});

export const EmailUserCreateSchema = z.object({
  username: z.string().min(1, "Meno je povinné"),
  password: z.string().min(8, "Heslo musí mať aspoň 8 znakov"),
  quota: z.number().optional(),
});

// ── FTP Users ──
export const FtpUserSchema = z.object({
  id: z.number().optional(),
  username: z.string().optional(),
  directory: z.string().optional(),
  created_at: z.string().optional(),
});

export const FtpUserListSchema = z.object({
  data: z.array(FtpUserSchema).optional(),
});

// ── Databases ──
export const DatabaseSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  size: z.number().optional(),
  created_at: z.string().optional(),
});

export const DatabaseListSchema = z.object({
  data: z.array(DatabaseSchema).optional(),
});

// ── Subdomains ──
export const SubdomainSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  domain: z.string().optional(),
  document_root: z.string().optional(),
  created_at: z.string().optional(),
});

export const SubdomainListSchema = z.object({
  data: z.array(SubdomainSchema).optional(),
});

// ── VPS ──
export const VpsSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  ip: z.string().optional(),
  os: z.string().optional(),
  ram: z.number().optional(),
  cpu: z.number().optional(),
  storage: z.number().optional(),
  created_at: z.string().optional(),
});

export const VpsListSchema = z.object({
  data: z.array(VpsSchema).optional(),
});

// ── Git Deploy ──
export const GitDeploySchema = z.object({
  id: z.number().optional(),
  repository: z.string().optional(),
  branch: z.string().optional(),
  status: z.string().optional(),
  last_deploy: z.string().optional(),
});

// ── Type exports ──
export type DomainCheck = z.infer<typeof DomainCheckSchema>;
export type Domain = z.infer<typeof DomainSchema>;
export type DomainRegister = z.infer<typeof DomainRegisterSchema>;
export type DomainTransfer = z.infer<typeof DomainTransferSchema>;
export type HostingPlan = z.infer<typeof HostingPlanSchema>;
export type PlanCreate = z.infer<typeof PlanCreateSchema>;
export type HostedDomain = z.infer<typeof HostedDomainSchema>;
export type DnsRecord = z.infer<typeof DnsRecordSchema>;
export type DnsRecordCreate = z.infer<typeof DnsRecordCreateSchema>;
export type EmailUser = z.infer<typeof EmailUserSchema>;
export type EmailUserCreate = z.infer<typeof EmailUserCreateSchema>;
export type FtpUser = z.infer<typeof FtpUserSchema>;
export type Database = z.infer<typeof DatabaseSchema>;
export type Subdomain = z.infer<typeof SubdomainSchema>;
export type Vps = z.infer<typeof VpsSchema>;
export type GitDeploy = z.infer<typeof GitDeploySchema>;
