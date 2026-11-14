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
  limits: Limits;
  battery?: number;
  light?: number;
  temperature?: number;
  humidity?: number;
  updatedAt?: number;
  status: Status;
}
