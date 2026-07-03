"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import {
  useProfileDraftStore,
  type DraftStep,
  type ProfileDraft,
} from "@/stores/use-profile-draft-store";
import {
  RIDER_THEMES,
  themeAccent,
  createProfileInputSchema,
  type RiderTheme,
} from "@/lib/profiles";
import { createProfileAction } from "@/lib/actions";
import { PRICE } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const STEPS: { key: DraftStep; label: string }[] = [
  { key: "dados", label: "Dados" },
  { key: "vitais", label: "Vitais" },
  { key: "seguro", label: "Seguro" },
  { key: "tema", label: "Tema" },
  { key: "pagamento", label: "Pagamento" },
];

// Validação por etapa (subconjuntos do schema de criação).
const stepSchemas: Record<DraftStep, z.ZodTypeAny> = {
  dados: createProfileInputSchema.pick({
    name: true,
    emergencyContactName: true,
    emergencyContactRelation: true,
    emergencyContactPhone: true,
  }),
  vitais: createProfileInputSchema.pick({ bloodType: true }),
  seguro: z.object({}), // toda a seção é opcional
  tema: z.object({}),
  pagamento: z.object({}),
};

export default function CriarPage() {
  const router = useRouter();
  const { step, draft, setStep, update, reset } = useProfileDraftStore();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Evita mismatch de hidratação: o store persiste em localStorage.
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const idx = STEPS.findIndex((s) => s.key === step);

  // Aplica o tema escolhido ao próprio wizard, ao vivo.
  const accent = themeAccent[draft.theme];
  const themeStyle = {
    "--primary": accent.primary,
    "--ring": accent.ring,
    "--accent": accent.accent,
  } as CSSProperties;

  function goNext() {
    const result = stepSchemas[step].safeParse(draft);
    if (!result.success) {
      const issue = (result as z.ZodSafeParseError<unknown>).error.issues[0];
      toast.error(issue?.message ?? "Preencha os campos obrigatórios");
      return;
    }
    setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)].key);
  }

  function goBack() {
    setStep(STEPS[Math.max(idx - 1, 0)].key);
  }

  async function pay() {
    setSubmitting(true);
    try {
      // Pagamento SIMULADO. Aqui entra o Mercado Pago (cartão/Pix) — o perfil
      // só deve ser criado após confirmação real via webhook.
      await new Promise((r) => setTimeout(r, 900));
      const res = await createProfileAction(draft);
      if (!res.ok) {
        if (res.needAuth) {
          // Rascunho fica salvo (Zustand persist) — volta e conclui após login.
          toast.message("Entre com o Google para salvar seu Rider ID");
          router.push("/entrar?next=/criar");
          return;
        }
        toast.error(res.error);
        setSubmitting(false);
        return;
      }
      const token = res.token;
      reset();
      router.push(`/criar/sucesso?token=${token}`);
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
      setSubmitting(false);
    }
  }

  return (
    <main
      style={themeStyle}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 py-8"
    >
      <Stepper current={idx} />

      {step === "dados" && <DadosStep draft={draft} update={update} />}
      {step === "vitais" && <VitaisStep draft={draft} update={update} />}
      {step === "seguro" && <SeguroStep draft={draft} update={update} />}
      {step === "tema" && <TemaStep draft={draft} update={update} />}
      {step === "pagamento" && <PagamentoStep draft={draft} />}

      <div className="mt-2 flex gap-3">
        {idx > 0 && (
          <Button variant="secondary" size="lg" onClick={goBack} disabled={submitting}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        )}
        {step !== "pagamento" ? (
          <Button size="lg" className="flex-1" onClick={goNext}>
            Continuar
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button size="lg" className="flex-1" onClick={pay} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Pagar {PRICE.amount} e gerar meu QR
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </main>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex flex-1 flex-col gap-1.5">
          <div
            className={
              "h-1 rounded-full " + (i <= current ? "bg-primary" : "bg-muted")
            }
          />
          <span
            className={
              "text-[0.7rem] " +
              (i <= current ? "text-foreground" : "text-muted-foreground")
            }
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

type StepProps = {
  draft: ProfileDraft;
  update: (patch: Partial<ProfileDraft>) => void;
};

function Field({
  id,
  label,
  children,
  hint,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

function DadosStep({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <StepHeader title="Seus dados" subtitle="Quem é o rider e quem avisar numa emergência." />
      <Field id="name" label="Nome completo">
        <Input
          id="name"
          value={draft.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Ex: Christian Martins"
        />
      </Field>
      <Field id="tagline" label="Apelido / estilo (opcional)">
        <Input
          id="tagline"
          value={draft.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          placeholder="Ex: Rider · Estradas & Aventura"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="contact" label="Contato de emergência">
          <Input
            id="contact"
            value={draft.emergencyContactName}
            onChange={(e) => update({ emergencyContactName: e.target.value })}
            placeholder="Ex: Maria"
          />
        </Field>
        <Field id="relation" label="Parentesco">
          <Input
            id="relation"
            value={draft.emergencyContactRelation}
            onChange={(e) => update({ emergencyContactRelation: e.target.value })}
            placeholder="Ex: esposa"
          />
        </Field>
      </div>
      <Field id="phone" label="Telefone do contato" hint="Com DDD. Usado para ligar e enviar localização.">
        <Input
          id="phone"
          inputMode="tel"
          value={draft.emergencyContactPhone}
          onChange={(e) => update({ emergencyContactPhone: e.target.value })}
          placeholder="Ex: 11 99999-8888"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="moto" label="Moto (opcional)">
          <Input
            id="moto"
            value={draft.motoModel}
            onChange={(e) => update({ motoModel: e.target.value })}
            placeholder="Ex: Honda XRE 300"
          />
        </Field>
        <Field id="plate" label="Placa (opcional)">
          <Input
            id="plate"
            value={draft.motoPlate}
            onChange={(e) => update({ motoPlate: e.target.value })}
            placeholder="Ex: ABC-1D23"
          />
        </Field>
      </div>
    </div>
  );
}

function VitaisStep({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <StepHeader
        title="Dados vitais"
        subtitle="O que quem for te socorrer precisa saber na hora."
      />
      <Field id="blood" label="Tipo sanguíneo">
        <Input
          id="blood"
          value={draft.bloodType}
          onChange={(e) => update({ bloodType: e.target.value })}
          placeholder="Ex: O+"
        />
      </Field>
      <Field id="allergies" label="Alergias a medicamentos (opcional)">
        <Input
          id="allergies"
          value={draft.allergies}
          onChange={(e) => update({ allergies: e.target.value })}
          placeholder="Ex: Dipirona · Penicilina"
        />
      </Field>
      <Field id="conditions" label="Condições de saúde (opcional)">
        <Textarea
          id="conditions"
          value={draft.conditions}
          onChange={(e) => update({ conditions: e.target.value })}
          placeholder="Ex: Asma leve · usa bombinha (salbutamol)"
          rows={2}
        />
      </Field>
      <Field id="message" label="Recado do rider (opcional)">
        <Textarea
          id="message"
          value={draft.message}
          onChange={(e) => update({ message: e.target.value })}
          placeholder="Uma mensagem para quem parar para ajudar."
          rows={3}
        />
      </Field>
    </div>
  );
}

function SeguroStep({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <StepHeader
        title="Assistência 24h do seguro"
        subtitle="Opcional. Vira um botão no perfil que liga direto para a assistência 24h."
      />
      <Field
        id="insurancePhone"
        label="Telefone da assistência 24h"
        hint="Com DDD ou 0800. No perfil, quem socorrer toca e liga na hora."
      >
        <Input
          id="insurancePhone"
          inputMode="tel"
          value={draft.insurancePhone}
          onChange={(e) => update({ insurancePhone: e.target.value })}
          placeholder="Ex: 0800 700 1234"
        />
      </Field>
    </div>
  );
}

const THEME_LABELS: Record<RiderTheme, string> = {
  amber: "Âmbar",
  red: "Vermelho",
  blue: "Azul",
  green: "Verde",
};

function TemaStep({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <StepHeader title="Escolha o tema" subtitle="A cor de acento do seu perfil de emergência." />
      <div className="grid grid-cols-2 gap-3">
        {RIDER_THEMES.map((t) => {
          const selected = draft.theme === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => update({ theme: t })}
              className={
                "relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors " +
                (selected ? "border-primary bg-primary/10" : "border-border hover:bg-muted/40")
              }
            >
              <span className="flex items-center justify-between">
                <span
                  className="size-8 rounded-full"
                  style={{ background: themeAccent[t].primary }}
                />
                {selected && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold">{THEME_LABELS[t]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PagamentoStep({ draft }: { draft: ProfileDraft }) {
  return (
    <div className="flex flex-col gap-4">
      <StepHeader title="Pagamento" subtitle="Confira o resumo e conclua para gerar seu QR Code." />

      <Card className="gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Rider ID · assinatura</span>
          <span className="text-lg font-bold">
            {PRICE.amount}
            <span className="text-sm font-normal text-muted-foreground">{PRICE.period}</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{PRICE.note}</p>
        <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
          <Summary k="Nome" v={draft.name || "—"} />
          <Summary k="Contato" v={draft.emergencyContactName || "—"} />
          <Summary k="Tipo sanguíneo" v={draft.bloodType || "—"} />
          <Summary k="Tema" v={THEME_LABELS[draft.theme]} />
        </div>
      </Card>

      <div className="flex items-start gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          <b className="text-foreground">Pagamento simulado</b> nesta versão. A integração real
          (Mercado Pago — cartão e Pix) entra aqui, criando o perfil só após a confirmação.
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <QrCode className="size-4" />
        Seu QR Code é gerado na tela seguinte.
      </div>
    </div>
  );
}

function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="truncate font-medium">{v}</span>
    </div>
  );
}
