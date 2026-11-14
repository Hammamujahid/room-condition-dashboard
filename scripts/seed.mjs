// Mengisi data tetap 16 kelompok ke Firestore (koleksi "groups").
// Pakai: GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json node scripts/seed.mjs
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const batch = db.batch();
for (let i = 1; i <= 16; i++) {
  const n = String(i).padStart(2, "0");
  batch.set(db.collection("groups").doc(`kelompok${n}`), {
    name: `Kelompok ${n}`,
    members: [],
    limits: { lowBattery: 20, tempMin: 18, tempMax: 35 },
  }, { merge: true });
}
await batch.commit();
console.log("Selesai: 16 kelompok tersimpan di Firestore.");
