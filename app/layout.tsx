import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistem Informasi Monitoring Laboratorium",
  description:
    "Monitoring realtime baterai, intensitas cahaya, suhu, dan kelembapan di 16 laboratorium.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
