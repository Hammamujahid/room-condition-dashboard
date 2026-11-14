import Icon from "./Icons";
import StatusPill from "./StatusPill";
import { fmt, timeAgo } from "@/lib/sensors";
import type { Group, IconName } from "@/types/sensor";

interface ParamProps {
  icon: IconName;
  label: string;
  value?: number;
  unit: string;
  cls: string;
}

function Param({ icon, label, value, unit, cls }: ParamProps) {
  const empty = value == null;
  return (
    <div className="param">
      <span className="param-top">
        <Icon name={icon} className="param-ic" />
        <span className="param-l">{label}</span>
      </span>
      <span className={`param-v ${empty ? "" : cls}`}>
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
  const battDanger = g.battery != null && g.battery < g.limits.lowBattery;
  const labName = g.short.replace(/Laboratorium/gi, "Lab");
  return (
    <div className={`card group-card${stale ? " is-stale" : ""}`}>
      <div className="row">
        <div className="g-id">
          <div>
            <strong className="g-name">{g.name}</strong>
            <span className="g-cat">{labName}</span>
          </div>
        </div>
        <StatusPill status={g.status} />
      </div>

      <div className="param-row">
        <Param icon="thermometer" label="Suhu" value={g.temperature} unit="°C" cls={cls("c-t")} />
        <Param icon="droplet" label="Kelembapan" value={g.humidity} unit="%" cls={cls("c-h")} />
        <Param icon="sun" label="Cahaya" value={g.light} unit="lux" cls={cls("c-l")} />
      </div>

      <div className="batt-row">
        <span className={`batt-ic ${battDanger ? "danger" : stale ? "stale" : "c-b"}`}>
          <Icon name="battery" />
        </span>
        <span className="batt-l">Baterai</span>
        <span className={`batt-v ${battDanger ? "danger" : stale ? "stale" : "c-b"}`}>
          {g.battery == null ? "–" : fmt(g.battery)}
          {g.battery != null && <small> %</small>}
        </span>
      </div>

      <span className={`g-time${stale ? " stale" : ""}`}>
        <Icon name={stale ? "wifiOff" : "clock"} className="g-time-ic" />
        {stale && g.updatedAt != null ? "Data terakhir: " : "Diperbarui: "}
        {timeAgo(g.updatedAt, now)}
      </span>
    </div>
  );
}
