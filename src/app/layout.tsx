import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "HostBerry - Správa hostingu a domén",
  description: "Webová aplikácia na správu web hostingu a domén",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
