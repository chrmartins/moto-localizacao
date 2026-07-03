"use client";

import { useState } from "react";

export default function PolicyReveal({
  insurer,
  masked,
  full,
}: {
  insurer: string;
  masked: string;
  full: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div className={"policy" + (shown ? " shown" : "")}>
      <button className="policy-btn" onClick={() => setShown(true)} type="button">
        <div className="ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2l9 4v6c0 5-3.8 8.5-9 10-5.2-1.5-9-5-9-10V6l9-4z" />
          </svg>
        </div>
        <div className="txt">
          <div className="k">Seguradora · apólice</div>
          <div className="v">
            {insurer} · {shown ? full : masked}
          </div>
        </div>
        <div className="lock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Toque
        </div>
      </button>
    </div>
  );
}
