"use server";

import {
  profileRepository,
  createProfileInputSchema,
  type CreateProfileInput,
} from "@/lib/profiles";

export type CreateProfileResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

/**
 * Cria o perfil a partir do questionário. Hoje chamada após o pagamento
 * SIMULADO no wizard. Quando o Mercado Pago entrar, esta action deve ser
 * disparada pelo webhook de pagamento aprovado — nunca confiar no cliente
 * dizendo que pagou.
 */
export async function createProfileAction(
  input: CreateProfileInput,
): Promise<CreateProfileResult> {
  const parsed = createProfileInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const token = await profileRepository.createProfile(parsed.data);
  return { ok: true, token };
}
