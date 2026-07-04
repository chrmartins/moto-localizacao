"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Lado direito do topo do perfil. Renderiza no servidor como "Perfil de
 * emergência" (rápido, sem bloquear) e, no cliente, troca para o atalho
 * "Meu painel" se houver sessão — sem custo no render do socorro.
 */
export function PainelNav() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setLoggedIn(true);
    });
  }, []);

  if (loggedIn) {
    return (
      <Link
        href="/painel"
        className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-muted"
      >
        <LayoutDashboard className="size-3.5" />
        Meu painel
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Radio className="size-3.5 text-success" />
      Perfil de emergência
    </div>
  );
}
