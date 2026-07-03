import { redirect } from "next/navigation";
import { Bike, LogOut, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signOutAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function PainelPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-bold">Painel indisponível</h1>
        <p className="text-sm text-muted-foreground">
          Configure o Supabase (variáveis de ambiente) para habilitar login e painel.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/painel");

  const name = user.user_metadata?.full_name ?? user.email ?? "Rider";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
          <Bike className="size-5 text-primary" />
          RIDER ID
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOut className="size-4" />
            Sair
          </Button>
        </form>
      </div>

      <Card className="flex-row items-center gap-3 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <UserRound className="size-6" />
        </span>
        <span>
          <span className="block text-sm font-semibold">{name}</span>
          <span className="block text-xs text-muted-foreground">{user.email}</span>
        </span>
      </Card>

      <Card className="gap-2 p-4">
        <h2 className="text-sm font-semibold">Seu cadastro</h2>
        <p className="text-sm text-muted-foreground">
          Em breve: aqui você edita seus dados e reimprime seu QR Code.
        </p>
      </Card>
    </main>
  );
}
