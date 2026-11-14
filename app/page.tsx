"use client";
import { useMemo, useState } from "react";
import GroupCard from "@/components/GroupCard";
import Icon from "@/components/Icons";
import Sidebar from "@/components/Sidebar";
import { conditionOf } from "@/lib/sensors";
import { useGroups } from "@/hooks/useGroups";

type Filter = "semua" | "baik" | "periksa" | "tunggu";

const STAT_META: { key: string; label: string; icon: "grid" | "shield" | "wrench" | "clock"; cls: string }[] = [
  { key: "total", label: "Total Lab", icon: "grid", cls: "stat-c" },
  { key: "baik", label: "Kondisi baik", icon: "shield", cls: "stat-b" },
  { key: "periksa", label: "Perlu pemeriksaan", icon: "wrench", cls: "stat-t" },
  { key: "tunggu", label: "Menunggu data", icon: "clock", cls: "stat-o" },
];

export default function Home() {
  const { groups, loading, now } = useGroups();
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filter>("semua");
  const [navOpen, setNavOpen] = useState(false);

  const shown = useMemo(() => {
    let list = f === "semua" ? groups : groups.filter((g) => conditionOf(g) === f);
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(needle) ||
          g.short.toLowerCase().includes(needle)
      );
    }
    return [...list].sort((a, b) => a.id.localeCompare(b.id));
  }, [groups, q, f]);

  const count = (s: "baik" | "periksa" | "tunggu") =>
    shown.filter((g) => conditionOf(g) === s).length;
  const stats: Record<string, number> = {
    total: shown.length,
    baik: count("baik"),
    periksa: count("periksa"),
    tunggu: count("tunggu"),
  };

  return (
    <div className="shell">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="content">
        <div className="mobile-bar">
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label="Buka menu"
            onClick={() => setNavOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="title-block">
            <h1>Laboratorium - Lab TEKMED</h1>
            <p className="muted">
              Monitoring kondisi {groups.length} laboratorium secara realtime.
            </p>
          </div>
        </div>

        <section className="summary">
          {STAT_META.map((s) => (
            <div className={`card stat ${s.cls}`} key={s.key}>
              <span className="stat-ic">
                <Icon name={s.icon} />
              </span>
              <div>
                <span className="muted small">{s.label}</span>
                <strong>{stats[s.key]}</strong>
              </div>
            </div>
          ))}
        </section>

        <header className="top">
          <div className="title-block">
            <h1>Laboratorium - Lab Teknologi Elektro-Medis</h1>
            <p className="muted">
              Monitoring kondisi {groups.length} laboratorium secara realtime.
            </p>
          </div>
          <div className="actions">
            <div className="input-wrap">
              <Icon name="search" className="input-ic" />
              <label className="sr" htmlFor="cari">Cari laboratorium</label>
              <input
                id="cari"
                className="input"
                placeholder="Cari kelompok atau lab…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="select-wrap">
              <label className="sr" htmlFor="filter">Filter status</label>
              <select
                id="filter"
                className="input select"
                value={f}
                onChange={(e) => setF(e.target.value as Filter)}
              >
                <option value="semua">Semua status</option>
                <option value="baik">Kondisi baik</option>
                <option value="periksa">Perlu pemeriksaan</option>
                <option value="tunggu">Menunggu data</option>
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <section className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="card skeleton" key={i} />
            ))}
          </section>
        ) : (
          <section className="grid">
            {shown.map((g) => (
              <GroupCard key={g.id} g={g} now={now} />
            ))}
            {shown.length === 0 && (
              <div className="card empty">
                <Icon name="search" className="empty-ic" />
                <strong>Lab tidak ditemukan</strong>
                <span className="muted small">Coba kata kunci atau filter lain.</span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
