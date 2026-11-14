import StatusPill from "./StatusPill";
import { fmt, timeAgo } from "@/lib/sensors";
import type { Group } from "@/types/sensor";

interface MiniProps {
  label: string;
  value?: number;
  unit: string;
  cls: string;
}

function Mini({ label, value, unit, cls }: MiniProps) {
  const empty = value == null;
  return (
    <div className="mini">
      <span className="mini-l">{label}</span>
      <span className={`mini-v ${empty ? "" : cls}`}>
        {empty ? "–" : fmt(value)}
        {!empty && <small> {unit}</small>}
      </span>
    </div>
  );
}

export default function GroupCard({ g, now }: { g: Group; now: number }) {
  // Offline: nilai terakhir tetap tampil, tapi berwarna abu-abu
  const stale = g.status === "offline";
  const cls = (c: string) => (stale ? "stale" : c);
  return (
    <div className="card group-card">
      <div className="row">
        <strong>{g.name}</strong>
        <StatusPill status={g.status} />
      </div>
      <div className="mini-grid">
        <Mini label="Baterai" value={g.battery} unit="%" cls={g.status === "low" ? "danger" : cls("c-b")} />
        <Mini label="Cahaya" value={g.light} unit="lux" cls={cls("c-l")} />
        <Mini label="Suhu" value={g.temperature} unit="°C" cls={cls("c-t")} />
        <Mini label="Kelembapan" value={g.humidity} unit="%" cls={cls("c-h")} />
      </div>
      <span className="muted small">
        {stale && g.updatedAt != null ? "Data terakhir: " : "Diperbarui: "}
        {timeAgo(g.updatedAt, now)}
      </span>
    </div>
  );
}
