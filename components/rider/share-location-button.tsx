"use client";

import { useState } from "react";
import { Send, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareLocationButton({
  whatsapp,
  firstName,
}: {
  whatsapp: string;
  firstName: string;
}) {
  const [loading, setLoading] = useState(false);

  function share() {
    if (!("geolocation" in navigator)) {
      toast.error("GPS indisponível neste aparelho.");
      return;
    }
    setLoading(true);
    toast.loading("Obtendo localização...", { id: "geo" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const maps = `https://maps.google.com/?q=${lat},${lng}`;
        const msg = `EMERGÊNCIA: encontrei o(a) ${firstName} acidentado(a). Localização atual: ${maps}`;
        toast.success("Localização obtida! Abrindo WhatsApp...", { id: "geo" });
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
        setLoading(false);
      },
      () => {
        toast.error("Não foi possível obter a localização. Ative o GPS.", { id: "geo" });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <Button
      onClick={share}
      disabled={loading}
      variant="secondary"
      className="h-auto w-full justify-start gap-3 px-4 py-3 text-left"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Send className="size-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">Enviar minha localização</span>
        <span className="block text-xs text-muted-foreground">
          Manda o ponto exato para a família no WhatsApp
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Button>
  );
}
