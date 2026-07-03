import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { profileRepository, type Profile } from "@/lib/profiles";
import { supabaseGetProfileByToken } from "@/lib/supabase/profiles-repo";

// Resolve um perfil pelo token do QR.
// Com Supabase configurado, busca no banco; se não achar (ou sem config),
// cai nos perfis demo em memória — assim os exemplos seguem funcionando.
export async function getProfileByToken(token: string): Promise<Profile | null> {
  if (isSupabaseConfigured) {
    const fromDb = await supabaseGetProfileByToken(token);
    if (fromDb) return fromDb;
  }
  return profileRepository.getProfileByToken(token);
}
