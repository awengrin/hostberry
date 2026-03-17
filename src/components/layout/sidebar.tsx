"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Globe,
  Server,
  LayoutDashboard,
  HardDrive,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Domény",
    href: "/domains",
    icon: Globe,
    children: [
      { name: "Registrované domény", href: "/domains" },
      { name: "Registrácia", href: "/domains/register" },
      { name: "Transfer", href: "/domains/transfer" },
    ],
  },
  {
    name: "Hosting",
    href: "/hosting",
    icon: Server,
  },
  {
    name: "VPS",
    href: "/vps",
    icon: HardDrive,
  },
  {
    name: "Nastavenia",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm">
          HB
        </div>
        <span className="text-lg font-bold">HostBerry</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expanded === item.name;

            return (
              <li key={item.name}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() =>
                        setExpanded(isExpanded ? null : item.name)
                      }
                      className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>
                  )}
                </div>
                {hasChildren && isExpanded && (
                  <ul className="ml-7 mt-1 space-y-1">
                    {item.children!.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                            pathname === child.href
                              ? "text-[var(--primary)] font-medium"
                              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          )}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--destructive)]"
        >
          <LogOut className="h-4 w-4" />
          Odhlásiť sa
        </button>
      </div>
    </aside>
  );
}
