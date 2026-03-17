# HostBerry - Plán implementácie

## Prehľad
Webová aplikácia na správu web hostingu a domén prepojená na **HostCreators API** (`https://www.hostcreators.sk/api/v1/host/`).

---

## Tech Stack

| Vrstva | Technológia | Dôvod |
|--------|------------|-------|
| Framework | **Next.js 14+ (App Router)** | Full-stack, SSR, API routes, moderný React |
| Jazyk | **TypeScript** | Typová bezpečnosť pre API integráciu |
| UI | **Tailwind CSS + shadcn/ui** | Rýchly vývoj, konzistentný design |
| State | **React Query (TanStack Query)** | Caching, refetch, optimistic updates pre API volania |
| Auth | **NextAuth.js** | Session management, Bearer token storage |
| DB | **SQLite (Prisma)** | Lokálne cache, user settings, audit log |
| Validácia | **Zod** | Runtime validácia API request/response |

---

## HostCreators API - Mapovanie endpointov

Base URL: `https://www.hostcreators.sk/api/v1/host/`
Auth: `Bearer {{token}}`

### Identifikované moduly z API:

| Modul | Endpointy | Priorita |
|-------|-----------|----------|
| **Domain Registration** | Domain Check, Domain Create, Domain Store REGISTER, Domain Store TRANSFER, Domain List, Domain Destroy | P0 |
| **Hosting Plans** | Plan Create, Plan Store, List of Plans, Plan Destroy | P0 |
| **Domains** | List of domains, Domain Prune HTTP Cache, Domain Renew | P0 |
| **Domain DNS** | DNS record management | P1 |
| **Subdomains** | Subdomain CRUD | P1 |
| **Domain Email Users** | Email account management | P1 |
| **Domain FTP Users** | FTP account management | P2 |
| **Host Domain DB** | Database management | P1 |
| **Domain Virtual Mailbox** | Virtual mailbox management | P2 |
| **VPS** | VPS management | P2 |
| **Domain GIT Deploy** | Git deploy configuration | P2 |
| **Host Domain Verification** | Domain verification | P1 |
| **User Management** | User CRUD | P0 |

---

## Štruktúra projektu

```
hostberry/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout + providers
│   │   ├── page.tsx                  # Dashboard (prehľad)
│   │   ├── login/page.tsx            # Prihlásenie (API token)
│   │   ├── domains/
│   │   │   ├── page.tsx              # Zoznam domén
│   │   │   ├── register/page.tsx     # Registrácia novej domény
│   │   │   ├── transfer/page.tsx     # Transfer domény
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Detail domény
│   │   │       ├── dns/page.tsx      # DNS záznamy
│   │   │       ├── email/page.tsx    # Email účty
│   │   │       ├── ftp/page.tsx      # FTP účty
│   │   │       ├── db/page.tsx       # Databázy
│   │   │       ├── subdomains/page.tsx
│   │   │       ├── git-deploy/page.tsx
│   │   │       └── settings/page.tsx # Cache, renew, verification
│   │   ├── hosting/
│   │   │   ├── page.tsx              # Hosting plány
│   │   │   └── [id]/page.tsx         # Detail plánu
│   │   ├── vps/
│   │   │   └── page.tsx              # VPS správa
│   │   └── settings/page.tsx         # Nastavenia aplikácie
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # HostCreators API klient (fetch wrapper)
│   │   │   ├── types.ts              # API typy (request/response)
│   │   │   ├── domains.ts            # Domain registration endpoints
│   │   │   ├── hosting.ts            # Hosting plans endpoints
│   │   │   ├── dns.ts                # DNS endpoints
│   │   │   ├── email.ts              # Email endpoints
│   │   │   ├── ftp.ts                # FTP endpoints
│   │   │   ├── db.ts                 # Database endpoints
│   │   │   ├── vps.ts                # VPS endpoints
│   │   │   └── git-deploy.ts         # Git deploy endpoints
│   │   ├── auth.ts                   # NextAuth config
│   │   └── utils.ts                  # Helpers
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx           # Navigácia
│   │   │   ├── header.tsx            # Hlavička
│   │   │   └── breadcrumbs.tsx
│   │   ├── domains/
│   │   │   ├── domain-list.tsx
│   │   │   ├── domain-check-form.tsx
│   │   │   ├── domain-register-form.tsx
│   │   │   └── dns-record-table.tsx
│   │   ├── hosting/
│   │   │   ├── plan-list.tsx
│   │   │   └── plan-card.tsx
│   │   └── shared/
│   │       ├── data-table.tsx        # Reusable tabuľka
│   │       ├── status-badge.tsx
│   │       └── confirm-dialog.tsx
│   └── hooks/
│       ├── use-domains.ts            # React Query hooks pre domény
│       ├── use-hosting.ts
│       └── use-dns.ts
├── prisma/
│   └── schema.prisma                 # DB schéma (audit log, cache)
├── .env.local                        # API token, DB URL
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Implementačné kroky

### Fáza 1: Základ (API klient + Auth + Layout)

1. **Inicializácia projektu**
   - `npx create-next-app@latest` s TypeScript, Tailwind, App Router
   - Inštalácia závislostí: `shadcn/ui`, `@tanstack/react-query`, `zod`, `next-auth`, `prisma`

2. **HostCreators API klient** (`src/lib/api/client.ts`)
   - Fetch wrapper s Bearer token autentifikáciou
   - Error handling, retry logika, response typing
   - Zod schémy pre validáciu API odpovedí

3. **Autentifikácia**
   - Login stránka - užívateľ zadá svoj HostCreators API Bearer token
   - Token uložený v encrypted session (NextAuth)
   - Middleware na ochranu routes

4. **Layout a navigácia**
   - Sidebar s modulmi (Domény, Hosting, VPS, Nastavenia)
   - Responsive design, breadcrumbs
   - shadcn/ui theme setup

### Fáza 2: Správa domén (P0)

5. **Domain Registration**
   - Domain Check - vyhľadanie dostupnosti domény (`GET /domain/check?q=`)
   - Domain Register form - registrácia novej domény (`POST /domain/store`)
   - Domain Transfer form - transfer existujúcej domény (`POST /domain/store`)
   - Domain List - tabuľka všetkých domén (`GET /domain/list`)
   - Domain Destroy - zmazanie s potvrdením (`DEL /domain/destroy`)

6. **Domain Management**
   - Zoznam domén na hostingu (`GET /domains/list`)
   - Prune HTTP Cache (`GET /domain/prune-http-cache`)
   - Domain Renew (`PATCH /domain/renew`)
   - Domain Verification (`Host Domain Verification` endpoints)

### Fáza 3: Hosting plány (P0)

7. **Hosting Plans CRUD**
   - Zobrazenie dostupných plánov (`GET /plans/list`)
   - Vytvorenie plánu (`GET /plan/create` + `POST /plan/store`)
   - Zmazanie plánu (`DEL /plan/destroy`)

### Fáza 4: DNS + Email + DB (P1)

8. **DNS správa**
   - Zobrazenie DNS záznamov pre doménu
   - Pridanie/úprava/zmazanie A, AAAA, CNAME, MX, TXT, SRV záznamov
   - Inline editácia v tabuľke

9. **Email účty**
   - Zoznam email používateľov pre doménu
   - Vytvorenie/zmazanie email účtu
   - Virtual Mailbox management

10. **Databázy**
    - Zoznam databáz pre doménu
    - Vytvorenie/zmazanie databázy
    - Zobrazenie prístupových údajov

### Fáza 5: Pokročilé funkcie (P2)

11. **Subdomény** - CRUD operácie
12. **FTP účty** - správa FTP prístupov
13. **VPS správa** - zobrazenie a správa VPS
14. **GIT Deploy** - konfigurácia automatického deployu
15. **User Management** - správa používateľov

---

## Dashboard (hlavná stránka)

Dashboard zobrazí:
- Počet aktívnych domén a ich stav
- Prehľad hosting plánov
- Domény blížiace sa k expirácii
- Rýchle akcie (registrácia domény, check dostupnosti)
- Posledné aktivity

---

## Kľúčové technické rozhodnutia

1. **API proxy cez Next.js API routes** - token sa nikdy neposiela z klienta, všetky API volania idú cez server
2. **React Query** - automatický refetch, caching, optimistic updates
3. **Zod validácia** - runtime type-safety pre API odpovede (keďže Postman docs nemajú response schemas)
4. **Server Components** kde je to možné - rýchlejšie načítanie, menej JS na klientovi
5. **SQLite** - pre audit log (kto čo kedy zmenil) a cache domén/plánov

---

## Odhadovaný rozsah

| Fáza | Popis |
|------|-------|
| Fáza 1 | Základ - API klient, auth, layout |
| Fáza 2 | Správa domén - registrácia, list, detail |
| Fáza 3 | Hosting plány - CRUD |
| Fáza 4 | DNS, Email, Databázy |
| Fáza 5 | Subdomény, FTP, VPS, GIT Deploy |
