import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SensorWatch – Monitoring Sensor 16 Kelompok",
  description: "Monitoring realtime baterai, intensitas cahaya, suhu, dan kelembapan.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
