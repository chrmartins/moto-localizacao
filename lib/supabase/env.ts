// Config do Supabase lida de variáveis de ambiente.
// isSupabaseConfigured permite o app rodar (fallback in-memory) enquanto
// as chaves não estão definidas — nada quebra antes do setup.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
