import {
  ProfileEditor,
  type EditableProfile,
} from "@/components/painel/profile-editor";
import { PrintArts } from "@/components/rider/print-arts";
import { QrDownload } from "@/components/rider/qr-download";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signOutAction } from "@/lib/auth-actions";
import { themeAccent } from "@/lib/profiles";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseGetMyProfile } from "@/lib/supabase/profiles-repo";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRight,
  Bike,
  ExternalLink,
  LogOut,
  ScanLine,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function PainelPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-bold">Painel indisponível</h1>
        <p className="text-sm text-muted-foreground">
          Configure o Supabase (variáveis de ambiente) para habilitar login e
          painel.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/painel");

  const profile = await supabaseGetMyProfile();
  const name = user.user_metadata?.full_name ?? user.email ?? "Rider";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
          <Bike className="size-5 text-primary" />
          RIDER ID
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOut className="size-4" />
            Sair
          </Button>
        </form>
      </div>

      <Card className="flex-row items-center gap-3 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <UserRound className="size-6" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </span>
      </Card>

      {profile ? (
        <ProfileSection
          profileUrl={`${await baseUrl()}/perfil/${profile.token}`}
          profile={profile}
        />
      ) : (
        <Card className="items-start gap-3 p-5">
          <h2 className="text-base font-bold">
            Você ainda não criou seu Rider ID
          </h2>
          <p className="text-sm text-muted-foreground">
            Preencha o cadastro para gerar seu perfil de emergência e seu QR
            Code.
          </p>
          <Button render={<Link href="/criar" />} className="w-full">
            Criar meu Rider ID
            <ArrowRight className="size-4" />
          </Button>
        </Card>
      )}
    </main>
  );
}

async function ProfileSection({
  profile,
  profileUrl,
}: {
  profile: Awaited<ReturnType<typeof supabaseGetMyProfile>>;
  profileUrl: string;
}) {
  if (!profile) return null;

  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0d0f12", light: "#ffffff" },
  });

  const accent = themeAccent[profile.theme];
  const themeStyle = {
    "--primary": accent.primary,
    "--ring": accent.ring,
    "--accent": accent.accent,
  } as CSSProperties;

  const initial: EditableProfile = {
    name: profile.name,
    tagline: profile.tagline === "Rider" ? "" : profile.tagline,
    emergencyContactName: profile.emergencyContact.name,
    emergencyContactRelation: profile.emergencyContact.relation,
    emergencyContactPhone: profile.emergencyContact.phoneLabel,
    bloodType: profile.vitals.bloodType,
    allergies: profile.vitals.allergies,
    conditions: profile.vitals.conditions,
    insurancePhone: profile.assistance.phone,
    motoModel: profile.moto.model,
    motoPlate: profile.moto.plate,
    message: profile.message,
    theme: profile.theme,
  };

  return (
    <div style={themeStyle} className="flex flex-col gap-5">
      <Card
        className="items-center gap-0 overflow-hidden p-0"
        style={{ borderColor: "#dc2626", borderWidth: "1.5px" }}
      >
        {/* Header vermelho fixo — não segue o tema */}
        <div className="flex w-full items-start gap-3 bg-[#dc2626] px-4 py-3">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-white" />
          <div>
            <p className="text-sm font-extrabold leading-tight text-white">
              QR CODE DE EMERGÊNCIA
            </p>
            <p className="text-xs text-red-200">
              Cole no capacete — qualquer pessoa escaneia e acessa seus dados
              vitais
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 p-5">
          <p className="self-start text-xs text-muted-foreground">
            Se você sofrer um acidente, quem te socorrer aponta a câmera do
            celular para este código e acessa imediatamente seu tipo sanguíneo,
            alergias e contato de emergência —{" "}
            <span className="font-medium text-foreground">
              sem precisar desbloquear seu celular
            </span>
            .
          </p>

          <div
            className="rounded-2xl bg-white p-4"
            style={{ boxShadow: "0 0 0 3px #dc262640" }}
          >
            <Image
              src={qrDataUrl}
              alt="QR Code de emergência do Rider ID"
              width={200}
              height={200}
              unoptimized
              className="size-48"
            />
          </div>

          <div className="flex w-full items-center gap-2 rounded-lg bg-[#dc2626]/10 px-3 py-2 text-xs font-medium text-[#dc2626]">
            <ScanLine className="size-4 shrink-0" />
            Aponte a câmera do celular para escanear — não precisa de app
          </div>

          <code className="max-w-full truncate rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            {profileUrl}
          </code>

          <div className="flex w-full flex-col gap-2">
            <QrDownload
              dataUrl={qrDataUrl}
              filename={`rider-id-${profile.token}.png`}
            />
            <Button
              render={<Link href={`/perfil/${profile.token}`} />}
              variant="secondary"
              size="lg"
            >
              <ExternalLink className="size-4" />
              Ver meu perfil
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Editar os dados abaixo não muda o QR — o mesmo código segue válido
            no capacete.
          </p>
        </div>
      </Card>

      <PrintArts
        firstName={profile.firstName}
        name={profile.name}
        bloodType={profile.vitals.bloodType}
        qrDataUrl={qrDataUrl}
        token={profile.token}
      />

      <h2 className="text-sm font-semibold text-muted-foreground">
        Editar cadastro
      </h2>
      <ProfileEditor initial={initial} />
    </div>
  );
}
