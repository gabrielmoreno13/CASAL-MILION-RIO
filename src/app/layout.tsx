import type { Metadata } from "next";
import "./globals.css";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { CoupleProvider } from "@/contexts/CoupleContext";
import { FabMenu } from "@/components/layout/FabMenu";

export const metadata: Metadata = {
  title: "Casal Milionário",
  description: "Controle financeiro para casais com foco no primeiro milhão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4ADE80" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <GamificationProvider>
          <CoupleProvider>
            {children}
            <FabMenu />
          </CoupleProvider>
        </GamificationProvider>
      </body>
    </html>
  );
}
