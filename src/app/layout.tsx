import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALMABUILD PRO",
  description: "Отделка коммерческих помещений и поставка стройматериалов в Алматы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
