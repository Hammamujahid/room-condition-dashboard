"use client";
import Image from "next/image";
import Icon from "./Icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      <div className={`scrim${open ? " show" : ""}`} onClick={onClose} />
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="brand">
          <Image src="/logo.png" alt="Poltekkes Kemenkes Surabaya" width={236} height={68} className="brand-logo" priority />
        </div>

        <button
          type="button"
          className="side-item side-all active"
          onClick={onClose}
        >
          <span className="side-icon">
            <Icon name="grid" />
          </span>
          <span className="side-name">Semua Lab</span>
        </button>

        <div className="side-foot">
          <span className="foot-row">
            <span className="dot" />
            Server Terhubung
          </span>
          <span className="foot-sub">Sistem Informasi Monitoring Lab</span>
        </div>
      </aside>
    </>
  );
}
