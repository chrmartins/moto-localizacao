import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Users,
  TriangleAlert,
  HeartPulse,
  Hospital,
  Navigation,
  LifeBuoy,
  ShieldCheck,
  Bike,
  ChevronRight,
  Radio,
} from "lucide-react";
import { mapsDirUrl, themeAccent, type Profile } from "@/lib/profiles";
import { getProfileByToken } from "@/lib/profile-repo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShareLocationButton } from "@/components/rider/share-location-button";
import { SensitiveReveal } from "@/components/rider/sensitive-reveal";

export const dynamic = "force-dynamic";

export default async function RiderProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const profile = await getProfileByToken(token);
  if (!profile) notFound();

  const accent = themeAccent[profile.theme];
  const themeStyle = {
    "--primary": accent.primary,
    "--ring": accent.ring,
    "--accent": accent.accent,
  } as CSSProperties;

  return (
    <main
      style={themeStyle}
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pb-10 pt-[max(env(safe-area-inset-top),1rem)]"
    >
      {/* Faixa de brilho com a cor do tema (fica atrás do conteúdo) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent"
      />
      <TopBar />
      <EmergencyBlock profile={profile} />
      {profile.demoMode && (
        <p className="rounded-lg bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground">
          Protótipo · dados de exemplo para você validar o visual
        </p>
      )}
      <VitalsCard profile={profile} />
      <HospitalsCard profile={profile} />
      <SensitiveCard profile={profile} />
      <MoreInfo profile={profile} />
      <Footer />
    </main>
  );
}

function TopBar() {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1.5 text-sm font-bold tracking-wide text-primary">
        <Bike className="size-5" />
        RIDER ID
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Radio className="size-3.5 text-success" />
        Perfil de emergência
      </div>
    </div>
  );
}

function EmergencyBlock({ profile }: { profile: Profile }) {
  return (
    <Card className="gap-0 overflow-hidden border-destructive/40 bg-destructive/10 p-0">
      <div className="p-5">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 text-xs font-semibold text-destructive">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-destructive" />
          </span>
          Encontrou este capacete? Aja agora
        </div>

        <h1 className="text-2xl font-extrabold leading-tight">
          {profile.firstName} está ferido(a)?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fale o nome dele(a) em voz alta e siga os passos abaixo. Você pode salvar uma vida.
        </p>

        <div className="mt-4 flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm">
            <span className="font-semibold">Não remova o capacete.</span>{" "}
            <span className="text-muted-foreground">
              Só se ele(a) não estiver respirando. Movê-lo errado pode causar lesão grave na
              coluna. Espere o SAMU.
            </span>
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <ActionLink
            href="tel:192"
            tone="emergency"
            icon={<Phone className="size-5" />}
            title="Ligar para o SAMU · 192"
            subtitle="Ambulância e resgate"
          />
          <ActionLink
            href={`tel:${profile.emergencyContact.phone}`}
            tone="default"
            icon={<Users className="size-5" />}
            title="Avisar a família"
            subtitle={`${profile.emergencyContact.name} (${profile.emergencyContact.relation})`}
          />
          <ShareLocationButton
            whatsapp={profile.emergencyContact.whatsapp}
            firstName={profile.firstName}
          />
        </div>
      </div>
    </Card>
  );
}

function ActionLink({
  href,
  icon,
  title,
  subtitle,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "emergency" | "default";
}) {
  const emergency = tone === "emergency";
  return (
    <a
      href={href}
      className={
        "flex items-center gap-3 rounded-xl px-4 py-3 transition-transform active:scale-[0.99] " +
        (emergency
          ? "bg-destructive text-white shadow-lg shadow-destructive/30"
          : "border border-border bg-secondary text-secondary-foreground")
      }
    >
      <span
        className={
          "flex size-9 shrink-0 items-center justify-center rounded-lg " +
          (emergency ? "bg-white/20" : "bg-primary/15 text-primary")
        }
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span
          className={
            "block text-xs " + (emergency ? "text-white/80" : "text-muted-foreground")
          }
        >
          {subtitle}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 opacity-70" />
    </a>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-4 w-1 rounded-full bg-primary" />
      <h2 className="text-sm font-semibold text-muted-foreground">{children}</h2>
    </div>
  );
}

function VitalsCard({ profile }: { profile: Profile }) {
  const v = profile.vitals;
  return (
    <section>
      <SectionTitle>Dados vitais · para o socorro</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5">
        <Vital label="Tipo sanguíneo" highlight>
          {v.bloodType}
        </Vital>
        <Vital label="Alergias a remédios" danger>
          {v.allergies}
        </Vital>
        <Vital label="Condições de saúde" wide>
          {v.conditions}
        </Vital>
        {v.age && <Vital label="Idade">{v.age}</Vital>}
        {v.weight && <Vital label="Peso aprox.">{v.weight}</Vital>}
        {v.healthPlanPreference && (
          <Vital label="Plano / preferência" wide>
            {v.healthPlanPreference}
          </Vital>
        )}
      </div>
    </section>
  );
}

function Vital({
  label,
  children,
  highlight,
  danger,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
  danger?: boolean;
  wide?: boolean;
}) {
  return (
    <Card
      className={
        "gap-1 p-3 " +
        (wide ? "col-span-2 " : "") +
        (highlight ? "border-primary/40 bg-primary/10" : "")
      }
    >
      <span className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={
          "text-base font-semibold " +
          (highlight ? "text-primary " : "") +
          (danger ? "text-destructive" : "")
        }
      >
        {children}
      </span>
    </Card>
  );
}

function HospitalsCard({ profile }: { profile: Profile }) {
  if (profile.hospitals.length === 0) return null;
  return (
    <section>
      <SectionTitle>Hospitais mais próximos</SectionTitle>
      <Card className="gap-0 p-0">
        {profile.hospitals.map((h, i) => (
          <div key={h.name}>
            {i > 0 && <Separator />}
            <a
              href={mapsDirUrl(h.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 transition-colors hover:bg-muted/40"
            >
              <span
                className={
                  "flex size-9 shrink-0 items-center justify-center rounded-lg " +
                  (h.emergency ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")
                }
              >
                <Hospital className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{h.name}</span>
                <span
                  className={
                    "block text-xs " + (h.emergency ? "text-success" : "text-muted-foreground")
                  }
                >
                  {h.emergency ? "● " : ""}
                  {h.info}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold">{h.distanceKm}</span>
                <span className="block text-xs text-muted-foreground">{h.timeMin}</span>
              </span>
              <Navigation className="size-4 shrink-0 text-primary" />
            </a>
          </div>
        ))}
      </Card>
    </section>
  );
}

function SensitiveCard({ profile }: { profile: Profile }) {
  const insurancePhone = profile.assistance.phone;
  return (
    <section>
      <SectionTitle>Assistência &amp; Seguro</SectionTitle>
      <Card className="gap-0 p-0">
        {/* Assistência 24h do seguro — número de serviço, público. Toca e liga. */}
        {insurancePhone && (
          <>
            <a
              href={`tel:${insurancePhone}`}
              className="flex items-center gap-3 p-3.5 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <LifeBuoy className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">
                  Ligar para a assistência 24h
                </span>
                <span className="block text-xs text-muted-foreground">
                  Guincho e apoio do seguro · toque para ligar
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </a>
            <Separator />
          </>
        )}
        {/* Telefone da família — pessoal, atrás do gate de emergência. */}
        <div className="p-3.5">
          <SensitiveReveal>
            <InfoRow
              icon={<Phone className="size-5" />}
              k={`Contato — ${profile.emergencyContact.name}`}
              v={profile.emergencyContact.phoneLabel}
            />
          </SensitiveReveal>
        </div>
      </Card>
    </section>
  );
}

function InfoRow({
  icon,
  k,
  v,
}: {
  icon: React.ReactNode;
  k: string;
  v: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[0.7rem] uppercase tracking-wide text-muted-foreground">
          {k}
        </span>
        <span className="block text-sm font-semibold">{v}</span>
      </span>
    </div>
  );
}

function MoreInfo({ profile }: { profile: Profile }) {
  return (
    <Accordion multiple={false} className="w-full">
      <AccordionItem value="more" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">
          Mais informações sobre o rider
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <div>
            <div className="text-lg font-bold">{profile.name}</div>
            <div className="text-sm text-muted-foreground">{profile.tagline}</div>
          </div>
          {(profile.moto.model || profile.moto.plate || profile.moto.healthPlan) && (
            <div className="flex flex-col gap-3">
              {profile.moto.model && (
                <InfoRow icon={<Bike className="size-5" />} k="Moto" v={profile.moto.model} />
              )}
              {profile.moto.plate && (
                <InfoRow
                  icon={<ShieldCheck className="size-5" />}
                  k="Placa"
                  v={profile.moto.plate}
                />
              )}
              {profile.moto.healthPlan && (
                <InfoRow
                  icon={<HeartPulse className="size-5" />}
                  k="Plano de saúde"
                  v={profile.moto.healthPlan}
                />
              )}
            </div>
          )}
          {profile.message && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
              <Badge variant="secondary" className="mb-2">
                Recado do rider
              </Badge>
              <p className="text-sm text-muted-foreground">{profile.message}</p>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Footer() {
  return (
    <footer className="mt-2 flex flex-col items-center gap-1 pt-4 text-center">
      <Separator className="mb-3" />
      <p className="text-sm font-bold">Rider ID</p>
      <p className="text-xs text-muted-foreground">
        Perfil vinculado ao QR Code do capacete.
        <br />
        Suas informações, sempre à mão de quem precisar.
      </p>
      <Link href="/" className="mt-2 text-xs text-primary underline-offset-4 hover:underline">
        Criar o meu Rider ID
      </Link>
    </footer>
  );
}
