"use client";
import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { collection, onSnapshot } from "firebase/firestore";
import { db, rtdb } from "@/lib/firebase";
import { DEFAULT_LIMITS, GROUP_IDS, labDef, statusOf } from "@/lib/sensors";
import type { Group, GroupMeta, LiveData } from "@/types/sensor";

export function useGroups() {
  const [live, setLive] = useState<Record<string, LiveData> | null>(null);
  const [meta, setMeta] = useState<Record<string, GroupMeta>>({});
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const offLive = onValue(ref(rtdb, "groups"), (snap) =>
      setLive((snap.val() as Record<string, LiveData>) ?? {})
    );
    const offMeta = onSnapshot(collection(db, "groups"), (snap) => {
      const m: Record<string, GroupMeta> = {};
      snap.forEach((d) => {
        m[d.id] = d.data() as GroupMeta;
      });
      setMeta(m);
    });
    const tick = setInterval(() => setNow(Date.now()), 5000);
    return () => {
      offLive();
      offMeta();
      clearInterval(tick);
    };
  }, []);

  const groups = useMemo<Group[]>(() => {
    const ids = Array.from(
      new Set([...GROUP_IDS, ...Object.keys(meta), ...Object.keys(live ?? {})])
    ).sort();
    return ids.map((id) => {
      const m = meta[id] ?? {};
      const limits = { ...DEFAULT_LIMITS, ...m.limits };
      const def = labDef(id);
      const d = live?.[id] ?? null;
      return {
        id,
        name: m.name || labelFallback(id),
        short: def?.name || m.name || labelFallback(id),
        desc: def?.desc || "Belum ada deskripsi laboratorium.",
        icon: def?.icon || "grid",
        category: def?.category || "metrologi",
        limits,
        battery: d?.battery,
        light: d?.light,
        temperature: d?.temperature,
        humidity: d?.humidity,
        updatedAt: d?.updatedAt,
        status: statusOf(d, limits, now),
      };
    });
  }, [live, meta, now]);

  return { groups, loading: live === null, now };
}

function labelFallback(id: string): string {
  return `Kelompok ${id.replace("kelompok", "")}`;
}
