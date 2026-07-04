"use client";

import { useState } from "react";
import { Send, ChevronRight, MapPin, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type LocState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "located"; lat: number; lng: number; mapsUrl: string };

export function ShareLocationButton({
  whatsapp,
  firstName,
}: {
  whatsapp: string;
  firstName: string;
}) {
  const [loc, setLoc] = useState<LocState>({ status: "idle" });

  function locate() {
    if (!("geolocation" in navigator)) {
      toast.error("GPS indisponível neste aparelho.");
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
      () => {
        toast.error("Não foi possível obter a localização. Ative o GPS.");
        setLoc({ status: "idle" });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function sendWhatsApp() {
    if (loc.status !== "located") return;
    const msg = `EMERGÊNCIA: encontrei o(a) ${firstName} acidentado(a). Localização atual: ${loc.mapsUrl}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  if (loc.status === "located") {
    const { lat, lng, mapsUrl } = loc;
    const delta = 0.004;
    const embedUrl =
      `https://www.openstreetmap.org/export/embed.html` +
      `?bbox=${lng - delta},${lat - delta},${lng + delta},${lat + delta}` +
      `&layer=mapnik&marker=${lat},${lng}`;

    return (
      <div className="flex flex-col gap-2">
        {/* Mapa com a localização exata */}
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            src={embedUrl}
            width="100%"
            height="200"
            className="block border-0"
            title="Localização do acidente"
          />
        </div>

        {/* Coordenadas + link Google Maps */}
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="font-mono">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-primary underline-offset-2 hover:underline"
          >
            Abrir no Maps
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Botão de envio via WhatsApp */}
        <button
          onClick={sendWhatsApp}
          className="flex items-center gap-3 rounded-xl bg-destructive px-4 py-3 text-left shadow-lg shadow-destructive/30 transition-transform active:scale-[0.99]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
            <Send className="size-5" />
          </span>
          <span className="flex-1 text-white">
            <span className="block text-sm font-semibold">Enviar localização no WhatsApp</span>
            <span className="block text-xs text-white/80">
              Manda o ponto exato para a família agora
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-white/70" />
        </button>
      </div>
    );
  }

  return (
    <Button
      onClick={locate}
      disabled={loc.status === "loading"}
      variant="secondary"
      className="h-auto w-full justify-start gap-3 px-4 py-3 text-left"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {loc.status === "loading" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Send className="size-5" />
        )}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">
          {loc.status === "loading" ? "Obtendo localização…" : "Mostrar localização no mapa"}
        </span>
        <span className="block text-xs text-muted-foreground">
          {loc.status === "loading"
            ? "Aguarde, ativando GPS…"
            : "Exibe o ponto exato e envia para a família"}
        </span>
      </span>
      {loc.status === "idle" && (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </Button>
  );
}
