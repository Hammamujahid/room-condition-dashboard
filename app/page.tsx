"use client";
import { useState } from "react";
import GroupCard from "@/components/GroupCard";
import { useGroups } from "@/hooks/useGroups";
import type { Status } from "@/types/sensor";

export default function Home() {
  const { groups, loading, now } = useGroups();
  const [q, setQ] = useState("");

  const shown = groups.filter((g) => g.name.toLowerCase().includes(q.trim().toLowerCase()));
  const count = (s: Status) => groups.filter((g) => g.status === s).length;
  const online = count("online") + count("low");

  return (
    <>
      <header className="top">
        <div>
          <h1>SensorWatch</h1>
          <p className="muted">Monitoring realtime {groups.length} kelompok · baterai, cahaya, suhu, kelembapan</p>
        </div>
        <div className="actions">
          <label className="sr" htmlFor="cari">Cari kelompok</label>
          <input id="cari" className="input" placeholder="Cari kelompok…" value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="pill pill-online live"><span className="dot" />Realtime</span>
        </div>
      </header>

      <section className="summary">
        <div className="card stat"><span className="muted small">Total kelompok</span><strong>{groups.length}</strong></div>
        <div className="card stat"><span className="muted small">Online</span><strong>{online}</strong></div>
        <div className="card stat"><span className="muted small">Offline</span><strong>{count("offline")}</strong></div>
        <div className="card stat"><span className="muted small">Baterai rendah</span><strong>{count("low")}</strong></div>
      </section>

      {loading ? (
        <p className="muted">Memuat data…</p>
      ) : (
        <section className="grid">
          {shown.map((g) => <GroupCard key={g.id} g={g} now={now} />)}
          {shown.length === 0 && <p className="muted">Kelompok tidak ditemukan.</p>}
        </section>
      )}
    </>
  );
}
