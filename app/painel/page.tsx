import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { Bike, LogOut, UserRound, QrCode, ExternalLink, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseGetMyProfile } from "@/lib/supabase/profiles-repo";
import { signOutAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrDownload } from "@/components/rider/qr-download";
import { ProfileEditor, type EditableProfile } from "@/components/painel/profile-editor";

export const dynamic = "force-dynamic";

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function PainelPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-bold">Painel indisponível</h1>
        <p className="text-sm text-muted-foreground">
          Configure o Supabase (variáveis de ambiente) para habilitar login e painel.
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
          <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
        </span>
      </Card>

      {profile ? (
        <ProfileSection profileUrl={`${await baseUrl()}/r/${profile.token}`} profile={profile} />
      ) : (
        <Card className="items-start gap-3 p-5">
          <h2 className="text-base font-bold">Você ainda não criou seu Rider ID</h2>
          <p className="text-sm text-muted-foreground">
            Preencha o cadastro para gerar seu perfil de emergência e seu QR Code.
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
    <>
      <Card className="items-center gap-4 p-5">
        <div className="flex items-center gap-2 self-start text-sm font-semibold">
          <QrCode className="size-4 text-primary" />
          Seu QR Code
        </div>
        <div className="rounded-2xl bg-white p-4">
          <Image
            src={qrDataUrl}
            alt="QR Code do seu Rider ID"
            width={200}
            height={200}
            unoptimized
            className="size-48"
          />
        </div>
        <code className="max-w-full truncate rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          {profileUrl}
        </code>
        <div className="flex w-full flex-col gap-2">
          <QrDownload dataUrl={qrDataUrl} filename={`rider-id-${profile.token}.png`} />
          <Button
            render={<Link href={`/r/${profile.token}`} target="_blank" />}
            variant="secondary"
            size="lg"
          >
            <ExternalLink className="size-4" />
            Ver meu perfil
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Editar os dados abaixo não muda o QR — o mesmo código segue válido no capacete.
        </p>
      </Card>

      <h2 className="text-sm font-semibold text-muted-foreground">Editar cadastro</h2>
      <ProfileEditor initial={initial} />
    </>
  );
}
