import Link from "next/link";
import { Bike, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <QrCode className="size-8" />
      </span>
      <h1 className="text-xl font-bold">QR Code não encontrado</h1>
      <p className="text-sm text-muted-foreground">
        Este código não corresponde a nenhum perfil ativo. Ele pode ter sido revogado
        (capacete vendido ou substituído) ou o link está incorreto.
      </p>
      <Button render={<Link href="/" />} variant="secondary" className="mt-2">
        <Bike className="size-4" />
        Conhecer o Rider ID
      </Button>
    </main>
  );
}
