"use client";

import { useState } from "react";
import Link from "next/link";
import { Bike, Loader2, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EntrarPage() {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") ?? "/painel";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setLoading(false);
    // Em sucesso, o browser é redirecionado ao Google.
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-6">
      <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
        <Bike className="size-5 text-primary" />
        RIDER ID
      </div>

      <Card className="w-full items-center gap-4 p-6 text-center">
        <h1 className="text-xl font-bold">Entrar</h1>
        <p className="text-sm text-muted-foreground">
          Acesse sua conta para editar seu cadastro e reimprimir seu QR Code.
        </p>

        {isSupabaseConfigured ? (
          <Button onClick={signInWithGoogle} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Entrar com Google
          </Button>
        ) : (
          <div className="flex items-start gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-left text-xs text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              Login indisponível: o Supabase ainda não foi configurado (faltam as variáveis de
              ambiente).
            </span>
          </div>
        )}
      </Card>

      <Link href="/" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
        Voltar para o início
      </Link>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M12 11v3.2h4.5c-.2 1.2-1.4 3.5-4.5 3.5-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c1.5 0 2.6.7 3.2 1.2l2.2-2.1C16.1 3.4 14.2 2.6 12 2.6 6.9 2.6 2.8 6.7 2.8 11.8S6.9 21 12 21c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
