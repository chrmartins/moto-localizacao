"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, Save } from "lucide-react";
import { RIDER_THEMES, themeAccent, type RiderTheme } from "@/lib/profiles";
import { updateProfileAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type EditableProfile = {
  name: string;
  tagline: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  bloodType: string;
  allergies: string;
  conditions: string;
  insurancePhone: string;
  motoModel: string;
  motoPlate: string;
  message: string;
  theme: RiderTheme;
};

const THEME_LABELS: Record<RiderTheme, string> = {
  amber: "Âmbar",
  red: "Vermelho",
  blue: "Azul",
  green: "Verde",
};

export function ProfileEditor({ initial }: { initial: EditableProfile }) {
  const router = useRouter();
  const [form, setForm] = useState<EditableProfile>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const res = await updateProfileAction(form);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Cadastro atualizado!");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <Group title="Dados">
        <FieldRow id="name" label="Nome completo">
          <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </FieldRow>
        <FieldRow id="tagline" label="Apelido / estilo">
          <Input
            id="tagline"
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </FieldRow>
      </Group>

      <Group title="Contato de emergência">
        <div className="grid grid-cols-2 gap-3">
          <FieldRow id="cname" label="Nome">
            <Input
              id="cname"
              value={form.emergencyContactName}
              onChange={(e) => set("emergencyContactName", e.target.value)}
            />
          </FieldRow>
          <FieldRow id="crel" label="Parentesco">
            <Input
              id="crel"
              value={form.emergencyContactRelation}
              onChange={(e) => set("emergencyContactRelation", e.target.value)}
            />
          </FieldRow>
        </div>
        <FieldRow id="cphone" label="Telefone">
          <Input
            id="cphone"
            inputMode="tel"
            value={form.emergencyContactPhone}
            onChange={(e) => set("emergencyContactPhone", e.target.value)}
          />
        </FieldRow>
      </Group>

      <Group title="Dados vitais">
        <FieldRow id="blood" label="Tipo sanguíneo">
          <Input
            id="blood"
            value={form.bloodType}
            onChange={(e) => set("bloodType", e.target.value)}
          />
        </FieldRow>
        <FieldRow id="allergies" label="Alergias">
          <Input
            id="allergies"
            value={form.allergies}
            onChange={(e) => set("allergies", e.target.value)}
          />
        </FieldRow>
        <FieldRow id="conditions" label="Condições de saúde">
          <Textarea
            id="conditions"
            rows={2}
            value={form.conditions}
            onChange={(e) => set("conditions", e.target.value)}
          />
        </FieldRow>
      </Group>

      <Group title="Seguro & Moto">
        <FieldRow id="ins" label="Telefone da assistência 24h">
          <Input
            id="ins"
            inputMode="tel"
            value={form.insurancePhone}
            onChange={(e) => set("insurancePhone", e.target.value)}
          />
        </FieldRow>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow id="moto" label="Moto">
            <Input
              id="moto"
              value={form.motoModel}
              onChange={(e) => set("motoModel", e.target.value)}
            />
          </FieldRow>
          <FieldRow id="plate" label="Placa">
            <Input
              id="plate"
              value={form.motoPlate}
              onChange={(e) => set("motoPlate", e.target.value)}
            />
          </FieldRow>
        </div>
      </Group>

      <Group title="Recado do rider">
        <Textarea
          rows={3}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Group>

      <Group title="Tema">
        <div className="grid grid-cols-4 gap-2">
          {RIDER_THEMES.map((t) => {
            const selected = form.theme === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => set("theme", t)}
                aria-label={THEME_LABELS[t]}
                className={
                  "relative flex items-center justify-center rounded-xl border p-3 transition-colors " +
                  (selected ? "border-primary bg-primary/10" : "border-border hover:bg-muted/40")
                }
              >
                <span
                  className="size-6 rounded-full"
                  style={{ background: themeAccent[t].primary }}
                />
                {selected && (
                  <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Group>

      <Button onClick={save} disabled={saving} size="lg" className="w-full">
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Salvar alterações
      </Button>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FieldRow({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
