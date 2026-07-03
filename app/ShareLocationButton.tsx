"use client";

import { useState } from "react";

export default function ShareLocationButton({
  whatsapp,
  firstName,
}: {
  whatsapp: string;
  firstName: string;
}) {
  const [status, setStatus] = useState("");

  function share() {
    setStatus("Obtendo localização...");
    if (!("geolocation" in navigator)) {
      setStatus("GPS indisponível neste aparelho.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const maps = `https://maps.google.com/?q=${lat},${lng}`;
        const msg = `EMERGÊNCIA: encontrei o ${firstName} acidentado. Localização atual: ${maps}`;
        setStatus("Localização obtida! Abrindo WhatsApp...");
        window.open(
          `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      },
      () => setStatus("Não foi possível obter a localização. Ative o GPS."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <>
      <button className="btn loc" onClick={share} type="button">
        <div className="b-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 11l17-8-8 17-2-7-7-2z" />
          </svg>
        </div>
        <div className="b-tx">
          <div className="t">Enviar minha localização</div>
          <div className="s">Manda o ponto exato para a família no WhatsApp</div>
        </div>
        <div className="b-go">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </button>
      <div className="loc-status">{status}</div>
    </>
  );
}
