import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrDownload } from "@/components/rider/qr-download";
import { PrintArts } from "@/components/rider/print-arts";
import { getProfileByToken } from "@/lib/profile-repo";

export const dynamic = "force-dynamic";

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function SucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-bold">Nada por aqui</h1>
        <p className="text-sm text-muted-foreground">
          Não encontramos um QR Code para exibir. Crie o seu perfil primeiro.
        </p>
        <Button render={<Link href="/criar" />} variant="secondary">
          Criar meu Rider ID
        </Button>
      </main>
    );
  }

  const profileUrl = `${await baseUrl()}/perfil/${token}`;
  // QR escuro sobre branco: máximo contraste para leitura em qualquer condição.
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0d0f12", light: "#ffffff" },
  });

  const profile = await getProfileByToken(token);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-success/15 text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="text-2xl font-extrabold">Seu Rider ID está pronto!</h1>
        <p className="text-sm text-muted-foreground">
          Cole este QR Code no seu capacete. Ao escaneá-lo, qualquer pessoa acessa seu perfil de
          emergência.
        </p>
      </div>

      <Card className="items-center gap-4 p-6">
        <div className="rounded-2xl bg-white p-4">
          <Image
            src={qrDataUrl}
            alt="QR Code do seu Rider ID"
            width={240}
            height={240}
            unoptimized
            className="size-60"
          />
        </div>
        <code className="max-w-full truncate rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          {profileUrl}
        </code>
      </Card>

      <div className="flex flex-col gap-2.5">
        <QrDownload dataUrl={qrDataUrl} filename={`rider-id-${token}.png`} />
        <Button render={<Link href={`/perfil/${token}`} target="_blank" />} variant="secondary" size="lg">
          <ExternalLink className="size-4" />
          Ver meu perfil de emergência
        </Button>
      </div>

      <PrintArts
        firstName={profile?.firstName ?? ""}
        name={profile?.name ?? ""}
        bloodType={profile?.vitals.bloodType ?? ""}
        theme={profile?.theme ?? "amber"}
        qrDataUrl={qrDataUrl}
        token={token}
      />
    </main>
  );
}
