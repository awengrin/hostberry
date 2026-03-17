"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/domains": "Domény",
  "/domains/register": "Registrácia domény",
  "/domains/transfer": "Transfer domény",
  "/hosting": "Hosting plány",
  "/vps": "VPS",
  "/settings": "Nastavenia",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "HostBerry";

  return (
    <header className="flex h-16 items-center border-b border-[var(--border)] bg-[var(--card)] px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
