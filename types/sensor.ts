export type Status = "online" | "offline" | "low";

export interface Limits {
  lowBattery: number;
  tempMin: number;
  tempMax: number;
}

/** Bentuk data di Realtime Database: groups/kelompokNN */
export interface LiveData {
  battery: number;
  light: number;
  temperature: number;
  humidity: number;
  updatedAt?: number;
}

/** Kategori klasifikasi laboratorium */
export type CategoryId =
  | "komputasi"
  | "elektronika"
  | "listrik"
  | "medis"
  | "metrologi";

/** Nama ikon SVG yang tersedia di components/Icons.tsx */
export type IconName =
  | "grid"
  | "cpu"
  | "chip"
  | "gate"
  | "monitor"
  | "wrench"
  | "radiation"
  | "stethoscope"
  | "bolt"
  | "plug"
  | "radio"
  | "shield"
  | "heartPulse"
  | "activity"
  | "atom"
  | "gauge"
  | "circuit"
  | "battery"
  | "sun"
  | "thermometer"
  | "droplet"
  | "search"
  | "menu"
  | "x"
  | "clock"
  | "wifiOff";

/** Bentuk dokumen di Firestore: groups/kelompokNN */
export interface GroupMeta {
  name?: string;
  members?: string[];
  limits?: Partial<Limits>;
}

/** Gabungan keduanya, dipakai oleh UI */
export interface Group {
  id: string;
  name: string;
  short: string;
  desc: string;
  icon: IconName;
  category: CategoryId;
  limits: Limits;
  battery?: number;
  light?: number;
  temperature?: number;
  humidity?: number;
  updatedAt?: number;
  status: Status;
}
