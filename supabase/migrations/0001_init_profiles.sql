-- Rider ID — schema inicial
-- Rode no SQL Editor do Supabase (ou via CLI). Cria a tabela de perfis,
-- ligada ao usuário autenticado (auth.users), com RLS.

create table if not exists public.profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  token               text not null unique,          -- token público do QR (/perfil/{token})
  active              boolean not null default true,  -- assinatura ativa (features premium)
  revoked             boolean not null default false, -- QR revogado (capacete vendido/perdido)
  theme               text not null default 'amber'
                        check (theme in ('amber', 'red', 'blue', 'green')),

  name                text not null,
  first_name          text not null,
  tagline             text not null default '',

  contact_name        text not null,
  contact_relation    text not null,
  contact_phone       text not null,   -- E.164, usado no tel:
  contact_phone_label text not null,
  contact_whatsapp    text not null,   -- só dígitos, usado no wa.me

  blood_type          text not null default '',
  allergies           text not null default '',
  conditions          text not null default '',

  insurance_phone     text not null default '', -- assistência 24h do seguro (tel:)

  moto_model          text not null default '',
  moto_plate          text not null default '',

  message             text not null default '',

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique (user_id) -- MVP: 1 perfil por usuário
);

create index if not exists profiles_token_idx on public.profiles (token);
create index if not exists profiles_user_id_idx on public.profiles (user_id);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ===== RLS =====
alter table public.profiles enable row level security;

-- Leitura pública: o QR é público, qualquer um pode ler um perfil não revogado.
-- (o app filtra por token; tokens são aleatórios e não-enumeráveis)
drop policy if exists "public read active profiles" on public.profiles;
create policy "public read active profiles"
  on public.profiles for select
  to anon, authenticated
  using (revoked = false);

-- O dono gerencia apenas o próprio perfil.
drop policy if exists "owner insert own profile" on public.profiles;
create policy "owner insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "owner update own profile" on public.profiles;
create policy "owner update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "owner delete own profile" on public.profiles;
create policy "owner delete own profile"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = user_id);
