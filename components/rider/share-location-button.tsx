"use client";

import {
  ChevronRight,
  ExternalLink,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";

type LocState =
  | { status: "loading" }
  | { status: "located"; lat: number; lng: number; mapsUrl: string }
  | { status: "error" };

export function ShareLocationButton({
  whatsapp,
  firstName,
}: {
  whatsapp: string;
  firstName: string;
}) {
  const [loc, setLoc] = useState<LocState>({ status: "loading" });

  function requestGeo() {
    if (!("geolocation" in navigator)) {
      setLoc({ status: "error" });
      return;
    }
    setLoc({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const mapsUrl = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
        setLoc({ status: "located", lat, lng, mapsUrl });
      },
      () => setLoc({ status: "error" }),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  useEffect(() => {
    requestGeo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function sendWhatsApp() {
    if (loc.status !== "located") return;
    const msg = `EMERGÊNCIA: encontrei o(a) ${firstName} acidentado(a). Localização atual: ${loc.mapsUrl}`;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }

  /* ── mapa (≈4 cm de altura) ── */
  const mapArea = (() => {
    if (loc.status === "loading") {
      return (
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/40">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-xs">Obtendo localização…</span>
          </div>
        </div>
      );
    }
    if (loc.status === "error") {
      return (
        <button
          onClick={requestGeo}
          className="flex h-40 w-full items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground"
        >
          <div className="flex flex-col items-center gap-1.5">
            <MapPin className="size-4" />
            <span className="text-xs">
              GPS indisponível — toque para tentar novamente
            </span>
          </div>
        </button>
      );
    }
    const { lat, lng } = loc;
    const d = 0.004;
    const embedUrl =
      `https://www.openstreetmap.org/export/embed.html` +
      `?bbox=${lng - d},${lat - d},${lng + d},${lat + d}` +
      `&layer=mapnik&marker=${lat},${lng}`;
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe
          src={embedUrl}
          width="100%"
          height="160"
          className="block border-0"
          title="Localização do acidente"
        />
      </div>
    );
  })();

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={sendWhatsApp}
        disabled={loc.status !== "located"}
        className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3 text-left text-secondary-foreground transition-transform active:scale-[0.99] disabled:opacity-40"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Send className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">
            Enviar localização no WhatsApp
          </span>
          <span className="block text-xs text-muted-foreground">
            Manda o ponto exato para a família agora
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {mapArea}

      {loc.status === "located" && (
        <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0 text-primary" />
          <span className="font-mono">
            {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
          </span>
          <a
            href={loc.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-primary underline-offset-2 hover:underline"
          >
            Maps <ExternalLink className="size-3" />
          </a>
        </div>
      )}
    </div>
  );
}
