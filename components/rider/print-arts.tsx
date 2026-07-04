"use client";

import { useRef } from "react";
import { Download, FileImage } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Detalhe sempre em vermelho de emergência (não segue o tema do perfil).
const RED = "#dc2626";
const RED_SOFT = "#fca5a5";

type Props = {
  firstName: string;
  name: string;
  bloodType: string;
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

export function PrintArts({ firstName, name, bloodType, qrDataUrl, token }: Props) {
  const stickerRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<SVGSVGElement>(null);
  const displayName = name || firstName || "Rider";

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold">Artes para imprimir</h2>
        <p className="text-sm text-muted-foreground">
          Sinalize que você tem um QR de emergência. O adesivo vai no capacete; a carteirinha,
          na carteira. Baixe e leve a uma gráfica ou impressora.
        </p>
      </div>

      {/* Adesivo redondo */}
      <Card className="items-center gap-4 p-5">
        <span className="self-start text-sm font-semibold">Adesivo redondo · capacete</span>
        <RoundSticker ref={stickerRef} firstName={firstName} qrDataUrl={qrDataUrl} />
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
        <WalletCard ref={cardRef} name={displayName} bloodType={bloodType} qrDataUrl={qrDataUrl} />
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

/** Cruz médica branca (símbolo universal de socorro). */
function MedicalCross({ cx, cy, s, fill = "#ffffff" }: { cx: number; cy: number; s: number; fill?: string }) {
  const arm = s;
  const th = s * 0.32;
  return (
    <g fill={fill}>
      <rect x={cx - arm} y={cy - th / 2} width={arm * 2} height={th} rx={th / 3} />
      <rect x={cx - th / 2} y={cy - arm} width={th} height={arm * 2} rx={th / 3} />
    </g>
  );
}

const RoundSticker = function RoundSticker({
  ref,
  firstName,
  qrDataUrl,
}: {
  ref: React.Ref<SVGSVGElement>;
  firstName: string;
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
      <circle cx="210" cy="210" r="208" fill={RED} />
      <circle cx="210" cy="210" r="190" fill="#0d0f12" />
      {/* linha tracejada sugerindo recorte do adesivo */}
      <circle cx="210" cy="210" r="199" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 5" />

      <MedicalCross cx={210} cy={44} s={13} />
      <text x="210" y="80" textAnchor="middle" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="1">
        EM CASO DE ACIDENTE
      </text>
      <text x="210" y="101" textAnchor="middle" fill={RED_SOFT} fontFamily="Arial, sans-serif" fontSize="12.5" letterSpacing="2.5">
        ESCANEIE O QR CODE
      </text>

      <rect x="122" y="116" width="176" height="176" rx="16" fill="#ffffff" />
      <image href={qrDataUrl} x="136" y="130" width="148" height="148" />

      <text x="210" y="330" textAnchor="middle" fill={RED} fontFamily="Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="0.5">
        ESCANEIE PARA AJUDAR
      </text>
      <text x="210" y="352" textAnchor="middle" fill="#cbd5e1" fontFamily="Arial, sans-serif" fontSize="12.5">
        dados vitais · contato de emergência
      </text>
      <text x="210" y="382" textAnchor="middle" fill="#94a3b8" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" letterSpacing="2">
        {firstName ? `RIDER ID · ${firstName.toUpperCase()}` : "RIDER ID"}
      </text>
    </svg>
  );
};

const WalletCard = function WalletCard({
  ref,
  name,
  bloodType,
  qrDataUrl,
}: {
  ref: React.Ref<SVGSVGElement>;
  name: string;
  bloodType: string;
  qrDataUrl: string;
}) {
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
      <rect x="1.5" y="1.5" width="1009" height="635" rx="38.5" fill="none" stroke={RED} strokeOpacity="0.5" strokeWidth="3" />

      {/* Banner de emergência */}
      <rect x="40" y="40" width="932" height="78" rx="18" fill={RED} />
      <MedicalCross cx={92} cy={79} s={17} />
      <text x="140" y="90" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="800" letterSpacing="0.5">
        EM CASO DE ACIDENTE — ESCANEIE
      </text>

      {/* QR à esquerda */}
      <rect x="56" y="150" width="330" height="330" rx="24" fill="#ffffff" />
      <image href={qrDataUrl} x="80" y="174" width="282" height="282" />
      <text x="221" y="522" textAnchor="middle" fill="#94a3b8" fontFamily="Arial, sans-serif" fontSize="24">
        Aponte a câmera do celular
      </text>

      {/* Info à direita */}
      <text x="430" y="212" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="800" letterSpacing="1">
        RIDER ID
      </text>
      <rect x="432" y="230" width="86" height="6" rx="3" fill={RED} />
      <text x="430" y="278" fill="#9aa4b2" fontFamily="Arial, sans-serif" fontSize="23">
        Escaneie para acessar meus dados
      </text>
      <text x="430" y="308" fill="#9aa4b2" fontFamily="Arial, sans-serif" fontSize="23">
        vitais, contato e assistência 24h.
      </text>

      <text x="430" y="374" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="20" letterSpacing="2">
        NOME
      </text>
      <text x="430" y="416" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize={nameSize} fontWeight="700">
        {name}
      </text>

      <text x="430" y="478" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="20" letterSpacing="2">
        TIPO SANGUÍNEO
      </text>
      <text x="430" y="522" fill={RED} fontFamily="Arial, sans-serif" fontSize="40" fontWeight="800">
        {bloodType || "—"}
      </text>
    </svg>
  );
};
