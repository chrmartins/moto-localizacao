import Link from "next/link";
import { Bike, QrCode, ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRICE } from "@/lib/pricing";

// Landing temporária (placeholder). A landing de venda da Fase 1 entra aqui depois.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
          <Bike className="size-5 text-primary" />
          RIDER ID
        </div>
        <Button render={<Link href="/entrar" />} variant="ghost" size="sm">
          Entrar
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-extrabold leading-tight">
          Quem te ama sabe onde te encontrar.
        </h1>
        <p className="text-muted-foreground">
          Um QR Code no seu capacete que abre, na hora do acidente, tudo que quem for te
          socorrer precisa saber — sem destravar o seu celular.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <Feature icon={<HeartPulse className="size-5" />} title="Dados vitais na hora">
          Tipo sanguíneo, alergias e condições visíveis para o socorro.
        </Feature>
        <Feature icon={<QrCode className="size-5" />} title="Basta escanear o capacete">
          Qualquer pessoa acessa pela câmera — não precisa de app.
        </Feature>
        <Feature icon={<ShieldCheck className="size-5" />} title="Privacidade em camadas">
          O que salva vida é público; o que te identifica fica protegido.
        </Feature>
      </div>

      <div className="flex flex-col gap-2">
        <Button render={<Link href="/criar" />} size="lg" className="w-full">
          Criar meu Rider ID
          <ArrowRight className="size-4" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {PRICE.amount}
          {PRICE.period} · {PRICE.note}
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ver um perfil de exemplo
        </p>
        <div className="flex flex-col gap-2">
          <Button
            render={<Link href="/r/k7bx9m2q" />}
            variant="secondary"
            className="justify-between"
          >
            Christian · Honda XRE 300
            <ArrowRight className="size-4" />
          </Button>
          <Button
            render={<Link href="/r/p3fw8ha2" />}
            variant="secondary"
            className="justify-between"
          >
            Ana · Yamaha Ténéré 250
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex-row items-center gap-3 p-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{children}</span>
      </span>
    </Card>
  );
}
