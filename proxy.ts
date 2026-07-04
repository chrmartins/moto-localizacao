import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renomeou a convenção "middleware" para "proxy".
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Só protege/renova sessão no /painel. Páginas públicas (perfil, landing,
  // criar) navegam sem a chamada de rede ao Supabase — mantém o SPA fluido.
  matcher: ["/painel/:path*"],
};
