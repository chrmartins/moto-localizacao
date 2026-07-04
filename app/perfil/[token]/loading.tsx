// Skeleton instantâneo enquanto o perfil carrega — evita a "tela vazia".
export default function Loading() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pb-10 pt-6">
      <div className="flex items-center justify-between pt-2">
        <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-32 animate-pulse rounded-full bg-muted/60" />
      </div>

      {/* Bloco de emergência */}
      <div className="h-72 animate-pulse rounded-2xl bg-muted/50" />

      {/* Vitais */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-20 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-20 animate-pulse rounded-xl bg-muted/50" />
        <div className="col-span-2 h-16 animate-pulse rounded-xl bg-muted/50" />
      </div>

      <div className="h-28 animate-pulse rounded-2xl bg-muted/50" />

      <p className="text-center text-xs text-muted-foreground">
        Carregando perfil de emergência…
      </p>
    </main>
  );
}
