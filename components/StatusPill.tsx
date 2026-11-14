import type { Status } from "@/types/sensor";

const TEXT: Record<Status, string> = {
  online: "Online",
  offline: "Offline",
  low: "Baterai rendah",
};

export default function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`pill pill-${status}`}>
      <span className="dot" />
      {TEXT[status]}
    </span>
  );
}
