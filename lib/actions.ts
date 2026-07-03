"use server";

import {
  profileRepository,
  createProfileInputSchema,
  type CreateProfileInput,
} from "@/lib/profiles";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  supabaseCreateMyProfile,
  supabaseUpdateMyProfile,
} from "@/lib/supabase/profiles-repo";

export type CreateProfileResult =
  | { ok: true; token: string }
  | { ok: false; needAuth?: boolean; error: string };

/**
 * Cria o perfil a partir do questionário.
 * - Com Supabase: exige login e grava ligado ao usuário (profile.user_id).
 *   Quando o Mercado Pago entrar, esta criação deve ser disparada pelo webhook
 *   de pagamento aprovado — nunca confiar no cliente dizendo que pagou.
 * - Sem Supabase: fallback demo em memória (sem login).
 */
export async function createProfileAction(
  input: CreateProfileInput,
): Promise<CreateProfileResult> {
  const parsed = createProfileInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  if (isSupabaseConfigured) {
    return supabaseCreateMyProfile(parsed.data);
  }

  const token = await profileRepository.createProfile(parsed.data);
  return { ok: true, token };
}

/** Atualiza o perfil do usuário logado (dashboard). Mantém o mesmo token/QR. */
export async function updateProfileAction(
  input: CreateProfileInput,
): Promise<CreateProfileResult> {
  const parsed = createProfileInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Edição requer o Supabase configurado." };
  }
  return supabaseUpdateMyProfile(parsed.data);
}
