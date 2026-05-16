import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simply Frio | Sistema de Gestão",
  description: "Sistema de estoque e financeiro - Simply Frio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
