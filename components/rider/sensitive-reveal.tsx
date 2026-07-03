"use client";

import { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Gate de privacidade: dados que identificam/expõem o rider (telefone visível,
 * apólice, hospital de preferência) ficam atrás de um toque "isto é uma
 * emergência real". Não é senha — senha inviabiliza o uso real no socorro —
 * é fricção mínima e intencional para não deixar tudo exposto a qualquer scan.
 */
export function SensitiveReveal({
  children,
  label = "Dados de identificação e seguro",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const [shown, setShown] = useState(false);

  if (shown) return <>{children}</>;

  return (
    <button
      type="button"
      onClick={() => setShown(true)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-dashed border-border/80",
        "bg-muted/40 px-4 py-4 text-left transition-colors hover:bg-muted/70",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Lock className="size-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">
          Toque para ver — apenas em caso de emergência real
        </span>
      </span>
      <ShieldAlert className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
