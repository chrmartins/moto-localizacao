# Setup do Supabase (auth Google + banco)

Passos manuais no painel do Supabase e Google Cloud para ativar login e persistência.
O código já está pronto; sem estas chaves o app roda em "modo demo" (in-memory, sem login).

## 1. Rodar o schema

Supabase → **SQL Editor** → New query → cole o conteúdo de
[`supabase/migrations/0001_init_profiles.sql`](../supabase/migrations/0001_init_profiles.sql) → **Run**.

Cria a tabela `profiles` (ligada a `auth.users`) com RLS.

## 2. Configurar o Google OAuth

No **Google Cloud Console** → APIs & Services → Credentials → **Create OAuth client ID** →
tipo **Web application**:

- **Authorized redirect URI:** `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
  (o `PROJECT_REF` está na URL do seu projeto Supabase)

Copie o **Client ID** e o **Client Secret**.

No **Supabase** → Authentication → **Providers** → **Google** → habilite → cole Client ID +
Secret → **Save**.

## 3. URLs de redirect (Supabase)

Supabase → Authentication → **URL Configuration**:

- **Site URL:** a URL de produção (ex: `https://moto-localizacao.vercel.app`)
- **Redirect URLs:** adicione
  - `http://localhost:3000/**`
  - `https://<seu-projeto>.vercel.app/**`

## 4. Variáveis de ambiente

Supabase → Project Settings → **API**:

| Valor no Supabase        | Variável                          |
| ------------------------ | --------------------------------- |
| Project URL              | `NEXT_PUBLIC_SUPABASE_URL`        |
| anon / publishable key   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   |

- **Local:** copie `.env.local.example` para `.env.local` e preencha.
- **Vercel:** Project Settings → Environment Variables → adicione as duas → **Redeploy**.

## 5. Testar

`/entrar` → **Entrar com Google** → deve voltar logado em `/painel`.
