import type { CategoryId, Group, IconName, Limits, LiveData, Status } from "@/types/sensor";

export const OFFLINE_AFTER_MS = 60_000; // tanpa update > 60 detik = offline
export const DEFAULT_LIMITS: Limits = { lowBattery: 20, tempMin: 18, tempMax: 35 };
export const HUM_MIN = 30;
export const HUM_MAX = 80;

export const GROUP_IDS: string[] = Array.from(
  { length: 16 },
  (_, i) => `kelompok${String(i + 1).padStart(2, "0")}`
);

export interface LabDef {
  id: string;
  num: number;
  name: string;
  desc: string;
  icon: IconName;
  category: CategoryId;
}

/** Klasifikasi laboratorium beserta konteksnya */
export const CATEGORIES: {
  id: CategoryId;
  name: string;
  desc: string;
  icon: IconName;
}[] = [
  { id: "komputasi", name: "Komputasi & Kendali", desc: "Mikrokontroler, logika digital, dan komputer", icon: "cpu" },
  { id: "elektronika", name: "Elektronika & Sensor", desc: "Rangkaian elektronika dan pengujian sensor", icon: "circuit" },
  { id: "listrik", name: "Kelistrikan & Bengkel", desc: "Tenaga listrik dan fabrikasi mekanik", icon: "bolt" },
  { id: "medis", name: "Kedokteran & Kesehatan", desc: "Alat kesehatan dan fisika medis", icon: "heartPulse" },
  { id: "metrologi", name: "Metrologi & Uji", desc: "Kalibrasi dan uji keandalan alat", icon: "gauge" },
];

export const LABS: LabDef[] = [
  { id: "kelompok01", num: 1, name: "Laboratorium Mikrokontroler", desc: "Praktikum pemrograman mikrokontroler dan sistem tertanam berbasis Arduino/ESP.", icon: "chip", category: "komputasi" },
  { id: "kelompok02", num: 2, name: "Laboratorium Digital", desc: "Praktikum logika digital: gerbang, flip-flop, hingga rangkaian sekuensial.", icon: "gate", category: "komputasi" },
  { id: "kelompok03", num: 3, name: "Laboratorium Devais Terprogram", desc: "Perancangan perangkat terprogram berbasis mikrokontroler dan SBC.", icon: "cpu", category: "komputasi" },
  { id: "kelompok04", num: 4, name: "Laboratorium Komputer", desc: "Perakitan, perawatan, dan jaringan komputer.", icon: "monitor", category: "komputasi" },
  { id: "kelompok05", num: 5, name: "Lab Bengkel", desc: "Fabrikasi mekanik, pengerjaan panel, dan perakitan alat.", icon: "wrench", category: "listrik" },
  { id: "kelompok06", num: 6, name: "Laboratorium Radiologi Dasar", desc: "Praktikum dasar radiologi dan pencitraan diagnostik.", icon: "radiation", category: "medis" },
  { id: "kelompok07", num: 7, name: "Laboratorium Klinik", desc: "Simulasi penggunaan alat kesehatan dalam pelayanan klinik.", icon: "stethoscope", category: "medis" },
  { id: "kelompok08", num: 8, name: "Laboratorium Teknik Tenaga Listrik (1)", desc: "Praktikum pembangkit, transmisi, dan distribusi tenaga listrik.", icon: "bolt", category: "listrik" },
  { id: "kelompok09", num: 9, name: "Laboratorium Teknik Tenaga Listrik (2)", desc: "Praktikum lanjutan: mesin listrik, pengukuran daya, dan proteksi.", icon: "plug", category: "listrik" },
  { id: "kelompok10", num: 10, name: "Laboratorium Sensor", desc: "Karakterisasi dan pengujian berbagai jenis sensor dan transduser.", icon: "radio", category: "elektronika" },
  { id: "kelompok11", num: 11, name: "Laboratorium Tegar", desc: "Ruang uji keandalan dan penyimpanan perangkat praktikum.", icon: "shield", category: "metrologi" },
  { id: "kelompok12", num: 12, name: "Laboratorium Life Support", desc: "Pemeliharaan alat penunjang hidup: ventilator, defibrilator, monitor pasien.", icon: "heartPulse", category: "medis" },
  { id: "kelompok13", num: 13, name: "Laboratorium Elektronika (1)", desc: "Dasar elektronika analog: rangkaian op-amp, dioda, dan transistor.", icon: "activity", category: "elektronika" },
  { id: "kelompok14", num: 14, name: "Laboratorium Fisika Kedokteran", desc: "Penerapan fisika dalam kedokteran: radiasi, ultrasonik, dan pencitraan.", icon: "atom", category: "medis" },
  { id: "kelompok15", num: 15, name: "Laboratorium Kalibrasi", desc: "Kalibrasi alat ukur terhadap standar nasional.", icon: "gauge", category: "metrologi" },
  { id: "kelompok16", num: 16, name: "Laboratorium Elektronika (2)", desc: "Elektronika lanjut: sirkuit terpadu dan perancangan PCB.", icon: "circuit", category: "elektronika" },
];

export function labDef(id: string): LabDef | undefined {
  return LABS.find((l) => l.id === id);
}

export const categoryDef = (id: CategoryId | undefined) =>
  CATEGORIES.find((c) => c.id === id);

export const fmt = (n: number, digits = 1): string =>
  Number(n).toLocaleString("id-ID", { maximumFractionDigits: digits });

export function statusOf(live: LiveData | null, limits: Limits, now: number): Status {
  if (!live || typeof live.updatedAt !== "number") return "offline";
  if (now - live.updatedAt > OFFLINE_AFTER_MS) return "offline";
  if (live.battery < limits.lowBattery) return "low";
  return "online";
}

export type Kondisi = "baik" | "periksa" | "tunggu";

/** Kondisi ruangan berdasarkan suhu & kelembapan terhadap threshold */
export function conditionOf(g: Group): Kondisi {
  if (g.status === "offline") return "tunggu";
  if (g.temperature == null || g.humidity == null) return "tunggu";
  const tOk = g.temperature >= g.limits.tempMin && g.temperature <= g.limits.tempMax;
  const hOk = g.humidity >= HUM_MIN && g.humidity <= HUM_MAX;
  return tOk && hOk ? "baik" : "periksa";
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
