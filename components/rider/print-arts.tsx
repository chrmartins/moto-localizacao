"use client";

import { useRef } from "react";
import { Download, FileImage } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RiderTheme } from "@/lib/profiles";

// Cores sólidas por tema, amigáveis para impressão.
const THEME_HEX: Record<RiderTheme, string> = {
  amber: "#f0902a",
  red: "#e2452f",
  blue: "#3b82f6",
  green: "#1fb271",
};

type Props = {
  firstName: string;
  name: string;
  bloodType: string;
  theme: RiderTheme;
  qrDataUrl: string;
  token: string;
};

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadSvg(svg: SVGSVGElement | null, filename: string) {
  if (!svg) return;
  const xml = new XMLSerializer().serializeToString(svg);
  saveBlob(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }), filename);
}

async function downloadPng(svg: SVGSVGElement | null, filename: string, scale = 3) {
  if (!svg) return;
  try {
    const xml = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("img"));
      img.src = url;
    });
    const vb = svg.viewBox.baseVal;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(vb.width * scale);
    canvas.height = Math.round(vb.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("ctx");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Falha ao gerar o PNG.");
        return;
      }
      saveBlob(blob, filename);
    }, "image/png");
  } catch {
    toast.error("Não foi possível gerar a imagem.");
  }
}

export function PrintArts({ firstName, name, bloodType, theme, qrDataUrl, token }: Props) {
  const stickerRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<SVGSVGElement>(null);
  const accent = THEME_HEX[theme];
  const displayName = name || firstName || "Rider";

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold">Artes para imprimir</h2>
        <p className="text-sm text-muted-foreground">
          Baixe e leve a uma gráfica ou impressora. O adesivo vai no capacete; a carteirinha,
          na carteira.
        </p>
      </div>

      {/* Adesivo redondo */}
      <Card className="items-center gap-4 p-5">
        <span className="self-start text-sm font-semibold">Adesivo redondo · capacete</span>
        <RoundSticker
          ref={stickerRef}
          firstName={firstName}
          accent={accent}
          qrDataUrl={qrDataUrl}
        />
        <div className="flex w-full gap-2">
          <Button className="flex-1" onClick={() => downloadPng(stickerRef.current, `adesivo-rider-${token}.png`)}>
            <Download className="size-4" />
            Baixar PNG
          </Button>
          <Button variant="secondary" onClick={() => downloadSvg(stickerRef.current, `adesivo-rider-${token}.svg`)}>
            <FileImage className="size-4" />
            SVG
          </Button>
        </div>
      </Card>

      {/* Carteirinha */}
      <Card className="items-center gap-4 p-5">
        <span className="self-start text-sm font-semibold">Carteirinha · carteira</span>
        <WalletCard
          ref={cardRef}
          name={displayName}
          bloodType={bloodType}
          accent={accent}
          qrDataUrl={qrDataUrl}
        />
        <div className="flex w-full gap-2">
          <Button className="flex-1" onClick={() => downloadPng(cardRef.current, `carteirinha-rider-${token}.png`)}>
            <Download className="size-4" />
            Baixar PNG
          </Button>
          <Button variant="secondary" onClick={() => downloadSvg(cardRef.current, `carteirinha-rider-${token}.svg`)}>
            <FileImage className="size-4" />
            SVG
          </Button>
        </div>
      </Card>
    </section>
  );
}

const RoundSticker = function RoundSticker({
  ref,
  firstName,
  accent,
  qrDataUrl,
}: {
  ref: React.Ref<SVGSVGElement>;
  firstName: string;
  accent: string;
  qrDataUrl: string;
}) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 420 420"
      width={420}
      height={420}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[240px]"
    >
      <circle cx="210" cy="210" r="208" fill={accent} />
      <circle cx="210" cy="210" r="192" fill="#0d0f12" />
      <circle cx="210" cy="210" r="192" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="2" />

      <text x="210" y="66" textAnchor="middle" fill={accent} fontFamily="Arial, sans-serif" fontSize="27" fontWeight="800" letterSpacing="2">
        EMERGÊNCIA
      </text>
      <text x="210" y="92" textAnchor="middle" fill="#cbd5e1" fontFamily="Arial, sans-serif" fontSize="15" letterSpacing="3">
        ESCANEIE O QR CODE
      </text>

      <rect x="112" y="110" width="196" height="196" rx="16" fill="#ffffff" />
      <image href={qrDataUrl} x="126" y="124" width="168" height="168" />

      <text x="210" y="350" textAnchor="middle" fill={accent} fontFamily="Arial, sans-serif" fontSize="28" fontWeight="800" letterSpacing="1">
        RIDER ID
      </text>
      <text x="210" y="374" textAnchor="middle" fill="#94a3b8" fontFamily="Arial, sans-serif" fontSize="15">
        {firstName ? `${firstName} · aponte a câmera` : "aponte a câmera do celular"}
      </text>
    </svg>
  );
};

const WalletCard = function WalletCard({
  ref,
  name,
  bloodType,
  accent,
  qrDataUrl,
}: {
  ref: React.Ref<SVGSVGElement>;
  name: string;
  bloodType: string;
  accent: string;
  qrDataUrl: string;
}) {
  // Reduz a fonte do nome se for longo, para não estourar.
  const nameSize = name.length > 18 ? 30 : name.length > 13 ? 36 : 42;
  return (
    <svg
      ref={ref}
      viewBox="0 0 1012 638"
      width={1012}
      height={638}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      <rect x="0" y="0" width="1012" height="638" rx="40" fill="#0d0f12" />
      <rect x="0" y="0" width="1012" height="638" rx="40" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="3" />

      {/* QR à esquerda */}
      <rect x="56" y="139" width="360" height="360" rx="24" fill="#ffffff" />
      <image href={qrDataUrl} x="80" y="163" width="312" height="312" />
      <text x="236" y="540" textAnchor="middle" fill="#94a3b8" fontFamily="Arial, sans-serif" fontSize="26">
        Aponte a câmera
      </text>

      {/* Info à direita */}
      <text x="470" y="150" fill={accent} fontFamily="Arial, sans-serif" fontSize="46" fontWeight="800" letterSpacing="1">
        RIDER ID
      </text>
      <rect x="472" y="168" width="96" height="7" rx="3.5" fill={accent} />
      <text x="470" y="212" fill="#94a3b8" fontFamily="Arial, sans-serif" fontSize="24">
        Perfil de emergência do motociclista
      </text>

      <text x="470" y="288" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="21" letterSpacing="2">
        NOME
      </text>
      <text x="470" y="332" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize={nameSize} fontWeight="700">
        {name}
      </text>

      <text x="470" y="404" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="21" letterSpacing="2">
        TIPO SANGUÍNEO
      </text>
      <text x="470" y="450" fill={accent} fontFamily="Arial, sans-serif" fontSize="42" fontWeight="800">
        {bloodType || "—"}
      </text>

      <text x="470" y="524" fill="#9aa4b2" fontFamily="Arial, sans-serif" fontSize="22">
        Escaneie o QR para dados vitais
      </text>
      <text x="470" y="554" fill="#9aa4b2" fontFamily="Arial, sans-serif" fontSize="22">
        e contato de emergência.
      </text>
    </svg>
  );
};
