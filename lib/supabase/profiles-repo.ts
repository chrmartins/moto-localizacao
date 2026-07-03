import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  buildProfile,
  generateToken,
  type Profile,
  type CreateProfileInput,
  type RiderTheme,
} from "@/lib/profiles";

// Linha da tabela public.profiles (snake_case).
type ProfileRow = {
  token: string;
  active: boolean;
  revoked: boolean;
  theme: RiderTheme;
  name: string;
  first_name: string;
  tagline: string;
  contact_name: string;
  contact_relation: string;
  contact_phone: string;
  contact_phone_label: string;
  contact_whatsapp: string;
  blood_type: string;
  allergies: string;
  conditions: string;
  insurance_phone: string;
  moto_model: string;
  moto_plate: string;
  message: string;
};

const COLUMNS =
  "token, active, revoked, theme, name, first_name, tagline, contact_name, contact_relation, contact_phone, contact_phone_label, contact_whatsapp, blood_type, allergies, conditions, insurance_phone, moto_model, moto_plate, message";

function rowToProfile(r: ProfileRow): Profile {
  return {
    token: r.token,
    active: r.active,
    revoked: r.revoked,
    theme: r.theme,
    demoMode: false,
    name: r.name,
    firstName: r.first_name,
    tagline: r.tagline,
    emergencyContact: {
      name: r.contact_name,
      relation: r.contact_relation,
      phone: r.contact_phone,
      phoneLabel: r.contact_phone_label,
      whatsapp: r.contact_whatsapp,
    },
    vitals: {
      bloodType: r.blood_type,
      allergies: r.allergies,
      conditions: r.conditions,
      age: "",
      weight: "",
      healthPlanPreference: "",
    },
    hospitals: [],
    assistance: { phone: r.insurance_phone },
    moto: { model: r.moto_model, plate: r.moto_plate, healthPlan: "" },
    message: r.message,
  };
}

// Colunas editáveis derivadas do questionário (não inclui token/user_id).
function inputToColumns(input: CreateProfileInput) {
  const p = buildProfile("", input); // reusa a normalização (telefone, firstName)
  return {
    theme: p.theme,
    name: p.name,
    first_name: p.firstName,
    tagline: p.tagline,
    contact_name: p.emergencyContact.name,
    contact_relation: p.emergencyContact.relation,
    contact_phone: p.emergencyContact.phone,
    contact_phone_label: p.emergencyContact.phoneLabel,
    contact_whatsapp: p.emergencyContact.whatsapp,
    blood_type: p.vitals.bloodType,
    allergies: p.vitals.allergies,
    conditions: p.vitals.conditions,
    insurance_phone: p.assistance.phone,
    moto_model: p.moto.model,
    moto_plate: p.moto.plate,
    message: p.message,
  };
}

// Leitura pública pelo token (RLS permite anon em perfis não revogados).
export async function supabaseGetProfileByToken(token: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(COLUMNS)
    .eq("token", token)
    .eq("revoked", false)
    .maybeSingle();
  if (error || !data) return null;
  return rowToProfile(data as ProfileRow);
}

// Perfil do usuário logado (para o dashboard).
export async function supabaseGetMyProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select(COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToProfile(data as ProfileRow);
}

export type CreateResult =
  | { ok: true; token: string }
  | { ok: false; needAuth?: boolean; error: string };

// Cria o perfil do usuário logado. Se já existir, retorna o token existente.
export async function supabaseCreateMyProfile(input: CreateProfileInput): Promise<CreateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, needAuth: true, error: "Entre para salvar seu Rider ID" };

  const existing = await supabase
    .from("profiles")
    .select("token")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing.data?.token) return { ok: true, token: existing.data.token };

  const token = generateToken();
  const { error } = await supabase
    .from("profiles")
    .insert({ user_id: user.id, token, ...inputToColumns(input) });
  if (error) return { ok: false, error: error.message };
  return { ok: true, token };
}

// Atualiza o perfil do usuário logado (mantém o mesmo token).
export async function supabaseUpdateMyProfile(input: CreateProfileInput): Promise<CreateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, needAuth: true, error: "Sessão expirada. Entre novamente." };

  const { data, error } = await supabase
    .from("profiles")
    .update(inputToColumns(input))
    .eq("user_id", user.id)
    .select("token")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data?.token) return { ok: false, error: "Perfil não encontrado." };
  return { ok: true, token: data.token };
}
