// ===== Camada de dados do Rider ID =====
// Schema (Zod) + repositório abstrato + seed em memória.
// Hoje os perfis vivem num Map em memória. Para plugar Postgres/Supabase
// depois, basta reimplementar `getProfileByToken` — a UI não muda.

import { z } from "zod";

// ---------- Schema ----------

export const RIDER_THEMES = ["amber", "red", "blue", "green"] as const;
export const riderThemeSchema = z.enum(RIDER_THEMES);
export type RiderTheme = z.infer<typeof riderThemeSchema>;

export const hospitalSchema = z.object({
  name: z.string(),
  info: z.string(),
  emergency: z.boolean(), // pronto-socorro/trauma => destaca em verde
  distanceKm: z.string(),
  timeMin: z.string(),
  mapsQuery: z.string(), // nome ou "lat,lng" para o Google Maps
});
export type Hospital = z.infer<typeof hospitalSchema>;

export const profileSchema = z.object({
  // Token público do QR (vem na URL /r/{token}). Revogável sem apagar o perfil.
  token: z.string().min(4),
  // Assinatura ativa habilita features premium (edição, notificação de scan).
  // A camada que salva vida é renderizada mesmo com a assinatura vencida.
  active: z.boolean().default(true),
  // Tag revogada (roubo/venda da capacete) => a rota responde 404.
  revoked: z.boolean().default(false),
  theme: riderThemeSchema.default("amber"),
  demoMode: z.boolean().default(false),

  name: z.string(),
  firstName: z.string(),
  tagline: z.string(),

  emergencyContact: z.object({
    name: z.string(),
    relation: z.string(),
    phone: z.string(), // E.164, usado no tel:
    phoneLabel: z.string(),
    whatsapp: z.string(), // só dígitos, usado no wa.me
  }),

  vitals: z.object({
    bloodType: z.string(),
    allergies: z.string(),
    conditions: z.string(),
    age: z.string(),
    weight: z.string(),
    healthPlanPreference: z.string(),
  }),

  hospitals: z.array(hospitalSchema),

  // Telefone de emergência/assistência 24h do seguro (número de serviço, público).
  assistance: z.object({
    phone: z.string(),
  }),

  moto: z.object({
    model: z.string(),
    plate: z.string(),
    healthPlan: z.string(),
  }),

  message: z.string(),
});
export type Profile = z.infer<typeof profileSchema>;

// ---------- Repositório (abstração) ----------

export interface ProfileRepository {
  getProfileByToken(token: string): Promise<Profile | null>;
  createProfile(input: CreateProfileInput): Promise<string>; // retorna o token
}

// Schema do que o questionário coleta (MVP). Espelha o rascunho do wizard.
export const createProfileInputSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome completo"),
  tagline: z.string().trim().max(60).optional().default(""),
  emergencyContactName: z.string().trim().min(2, "Informe o contato de emergência"),
  emergencyContactRelation: z.string().trim().min(2, "Informe o parentesco"),
  emergencyContactPhone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(20, "Telefone inválido"),
  bloodType: z.string().trim().min(1, "Informe o tipo sanguíneo"),
  allergies: z.string().trim().default(""),
  conditions: z.string().trim().default(""),
  motoModel: z.string().trim().default(""),
  motoPlate: z.string().trim().default(""),
  insurancePhone: z.string().trim().default(""),
  message: z.string().trim().max(400).default(""),
  theme: riderThemeSchema.default("amber"),
});
export type CreateProfileInput = z.infer<typeof createProfileInputSchema>;

// Token público do QR: curto, aleatório e não-enumerável (10 chars).
export function generateToken(): string {
  return globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

function normalizePhone(raw: string): { phone: string; phoneLabel: string; whatsapp: string } {
  const digits = raw.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return {
    phone: `+${withCountry}`,
    phoneLabel: raw.trim(),
    whatsapp: withCountry,
  };
}

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function buildProfile(token: string, input: CreateProfileInput): Profile {
  const contact = normalizePhone(input.emergencyContactPhone);
  return {
    token,
    active: true,
    revoked: false,
    theme: input.theme,
    demoMode: false,
    name: input.name,
    firstName: firstNameOf(input.name),
    tagline: input.tagline || "Rider",
    emergencyContact: {
      name: input.emergencyContactName,
      relation: input.emergencyContactRelation,
      phone: contact.phone,
      phoneLabel: contact.phoneLabel,
      whatsapp: contact.whatsapp,
    },
    vitals: {
      bloodType: input.bloodType,
      allergies: input.allergies || "Nenhuma alergia relatada",
      conditions: input.conditions || "Nenhuma condição pré-existente relatada",
      age: "",
      weight: "",
      healthPlanPreference: "",
    },
    hospitals: [], // Fase 2: geolocalização + API de lugares
    assistance: { phone: input.insurancePhone.replace(/\D/g, "") },
    moto: { model: input.motoModel, plate: input.motoPlate, healthPlan: "" },
    message: input.message,
  };
}

// ---------- Seed (implementação em memória) ----------

const seedProfiles: Profile[] = [
  {
    token: "k7bx9m2q",
    active: true,
    revoked: false,
    theme: "amber",
    demoMode: true,
    name: "Christian Martins",
    firstName: "Christian",
    tagline: "Rider · Estradas & Aventura",
    emergencyContact: {
      name: "Maria Martins",
      relation: "esposa",
      phone: "+5511999998888",
      phoneLabel: "11 99999-8888",
      whatsapp: "5511999998888",
    },
    vitals: {
      bloodType: "O+",
      allergies: "Dipirona · Penicilina",
      conditions: "Nenhuma condição pré-existente relatada",
      age: "34 anos",
      weight: "78 kg",
      healthPlanPreference: "Unimed · levar ao Hospital Santa Casa",
    },
    hospitals: [
      { name: "Hospital Santa Casa", info: "Pronto-socorro 24h", emergency: true, distanceKm: "1,2 km", timeMin: "~4 min", mapsQuery: "Hospital Santa Casa de São Paulo" },
      { name: "Hospital das Clínicas", info: "Trauma / emergência", emergency: true, distanceKm: "2,8 km", timeMin: "~9 min", mapsQuery: "Hospital das Clínicas FMUSP" },
      { name: "Hospital Sírio-Libanês", info: "Pronto atendimento", emergency: false, distanceKm: "3,5 km", timeMin: "~11 min", mapsQuery: "Hospital Sírio-Libanês São Paulo" },
    ],
    assistance: { phone: "08007001234" },
    moto: {
      model: "Honda XRE 300 · 2024 · Vermelha/Preta",
      plate: "ABC-1D23",
      healthPlan: "Unimed · 0000 0000 0000 00",
    },
    message:
      "Se você está lendo isso, obrigado por parar. Toda ajuda importa. Por favor, avise minha família — eles são tudo pra mim. Bora com cuidado, sempre. 🏍️",
  },
  {
    token: "p3fw8ha2",
    active: true,
    revoked: false,
    theme: "blue",
    demoMode: true,
    name: "Ana Beatriz Rocha",
    firstName: "Ana",
    tagline: "Rider · Trilhas & Serra",
    emergencyContact: {
      name: "Rafael Rocha",
      relation: "irmão",
      phone: "+5531988887777",
      phoneLabel: "31 98888-7777",
      whatsapp: "5531988887777",
    },
    vitals: {
      bloodType: "A-",
      allergies: "Nenhuma alergia a medicamentos relatada",
      conditions: "Asma leve · usa bombinha (salbutamol)",
      age: "29 anos",
      weight: "62 kg",
      healthPlanPreference: "Hapvida · Hospital Felício Rocho",
    },
    hospitals: [
      { name: "Hospital João XXIII", info: "Trauma / emergência 24h", emergency: true, distanceKm: "2,1 km", timeMin: "~7 min", mapsQuery: "Hospital João XXIII Belo Horizonte" },
      { name: "Hospital Felício Rocho", info: "Pronto-socorro", emergency: true, distanceKm: "3,0 km", timeMin: "~10 min", mapsQuery: "Hospital Felício Rocho Belo Horizonte" },
    ],
    assistance: { phone: "08007266100" },
    moto: {
      model: "Yamaha Ténéré 250 · 2023 · Azul",
      plate: "XYZ-2E45",
      healthPlan: "Hapvida · 1111 1111 1111 11",
    },
    message:
      "Obrigada por parar pra ajudar. Avisa meu irmão, por favor — e cuidado com a minha bombinha na jaqueta. Gratidão. 🤍",
  },
];

class InMemoryProfileRepository implements ProfileRepository {
  private byToken = new Map(seedProfiles.map((p) => [p.token, p] as const));

  async getProfileByToken(token: string): Promise<Profile | null> {
    const profile = this.byToken.get(token);
    if (!profile || profile.revoked) return null;
    return profile;
  }

  async createProfile(input: CreateProfileInput): Promise<string> {
    // NOTA: persistência em memória — sobrevive só no processo atual.
    // Em produção (Vercel serverless), trocar por Postgres/Supabase.
    let token = generateToken();
    while (this.byToken.has(token)) token = generateToken();
    this.byToken.set(token, buildProfile(token, input));
    return token;
  }
}

export const profileRepository: ProfileRepository = new InMemoryProfileRepository();

// ---------- Helpers ----------

export function mapsDirUrl(query: string) {
  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(query) +
    "&travelmode=driving"
  );
}

// Overrides de acento por tema (aplicados via CSS custom properties no wrapper).
export const themeAccent: Record<RiderTheme, { primary: string; ring: string; accent: string }> = {
  amber: { primary: "oklch(0.74 0.165 55)", ring: "oklch(0.74 0.165 55)", accent: "oklch(0.28 0.03 55)" },
  red: { primary: "oklch(0.62 0.23 22)", ring: "oklch(0.62 0.23 22)", accent: "oklch(0.28 0.05 22)" },
  blue: { primary: "oklch(0.62 0.14 250)", ring: "oklch(0.62 0.14 250)", accent: "oklch(0.28 0.04 250)" },
  green: { primary: "oklch(0.72 0.16 158)", ring: "oklch(0.72 0.16 158)", accent: "oklch(0.28 0.04 158)" },
};
