"use client";

import { useState } from "react";
import { rider } from "@/lib/rider";

export default function MoreInfo() {
  const [open, setOpen] = useState(false);

  return (
    <div className={"more" + (open ? " open" : "")}>
      <button className="more-toggle" onClick={() => setOpen((v) => !v)} type="button">
        Mais informações sobre o rider
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="more-body">
        <div className="prof-head">
          <div className="av-ph">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffb861" strokeWidth={1.6}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </div>
          <div>
            <div className="nm headline">{rider.name}</div>
            <div className="tg">{rider.tagline}</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 6 }}>
          <div className="row">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx="5" cy="17" r="3" />
                <circle cx="19" cy="17" r="3" />
                <path d="M8 17h6l3-6h-3l-2-3H6" />
              </svg>
            </div>
            <div className="txt">
              <div className="k">Moto</div>
              <div className="v">{rider.moto.model}</div>
            </div>
          </div>
          <div className="row">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M7 6V4h10v2" />
              </svg>
            </div>
            <div className="txt">
              <div className="k">Placa</div>
              <div className="v">{rider.moto.plate}</div>
            </div>
          </div>
          <div className="row">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M8 2v4M16 2v4M3 10h18" />
              </svg>
            </div>
            <div className="txt">
              <div className="k">Plano de saúde</div>
              <div className="v">{rider.moto.healthPlan}</div>
            </div>
          </div>
        </div>

        <div className="notes">
          <span className="tag">Recado do rider</span>
          {rider.message}
        </div>
      </div>
    </div>
  );
}
