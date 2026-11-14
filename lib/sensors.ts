import type { Limits, LiveData, Status } from "@/types/sensor";

export const OFFLINE_AFTER_MS = 60_000; // tanpa update > 60 detik = offline
export const DEFAULT_LIMITS: Limits = { lowBattery: 20, tempMin: 18, tempMax: 35 };

export const GROUP_IDS: string[] = Array.from(
  { length: 16 },
  (_, i) => `kelompok${String(i + 1).padStart(2, "0")}`
);

export const fmt = (n: number, digits = 1): string =>
  Number(n).toLocaleString("id-ID", { maximumFractionDigits: digits });

export function labelFromId(id: string): string {
  return `Kelompok ${id.replace("kelompok", "")}`;
}

export function statusOf(live: LiveData | null, limits: Limits, now: number): Status {
  if (!live || typeof live.updatedAt !== "number") return "offline";
  if (now - live.updatedAt > OFFLINE_AFTER_MS) return "offline";
  if (live.battery < limits.lowBattery) return "low";
  return "online";
}

/** "5 detik lalu", "3 menit lalu", dst. */
export function timeAgo(updatedAt: number | undefined, now: number): string {
  if (typeof updatedAt !== "number") return "Belum ada data";
  const s = Math.max(0, Math.round((now - updatedAt) / 1000));
  if (s < 60) return `${s} detik lalu`;
  if (s < 3600) return `${Math.floor(s / 60)} menit lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`;
  return `${Math.floor(s / 86400)} hari lalu`;
}
