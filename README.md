# Rider ID — Perfil de emergência do motociclista

Página mobile-first que abre ao escanear o QR Code do capacete. Mostra, em camadas:
emergência (SAMU, avisar família, enviar localização, aviso de capacete) → dados vitais →
localização e hospitais próximos → assistência/seguro → perfil completo (recolhido).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:3000

## Editar seus dados

Tudo o que aparece no perfil está em **`lib/rider.ts`** — nome, contato de emergência,
tipo sanguíneo, alergias, hospitais, seguradora, moto, etc.
Quando os dados forem reais, troque `demoMode: true` para `false` para sumir com o aviso de exemplo.

## Deploy na Vercel

Opção 1 — CLI:

```bash
npm i -g vercel
vercel        # primeira vez: login + configura o projeto
vercel --prod # publica em produção
```

Opção 2 — Git: suba este repositório para o GitHub e conecte na Vercel
(importa o projeto e faz deploy automático a cada push).

## Próximos passos (dinâmico)

- Localização e hospitais hoje são estáticos (exemplo). Para torná-los reais:
  usar geolocalização do navegador + API de lugares (Google Places ou OpenStreetMap/Overpass)
  para buscar hospitais próximos ordenados por distância.
- Proteger a apólice/dados sensíveis com PIN, já que o QR é público.
