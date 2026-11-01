-- Consolidated schema for the Elite Property PK database (Supabase / Postgres).
-- Rebuilt on 2026-11-01 when migrating off the restricted Supabase project.
-- Idempotent: safe to re-run.

create extension if not exists vector with schema extensions;

-- ---------------------------------------------------------------- crm_users
create table if not exists public.crm_users (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamptz default timezone('utc', now()) not null,
  email text not null unique,
  name text not null,
  role text not null default 'agent' check (role in ('admin', 'agent'))
);
alter table public.crm_users enable row level security;
drop policy if exists "Allow authenticated read to crm_users" on public.crm_users;
create policy "Allow authenticated read to crm_users" on public.crm_users
  for select using (auth.role() = 'authenticated');
drop policy if exists "Allow admin crud to crm_users" on public.crm_users;
create policy "Allow admin crud to crm_users" on public.crm_users
  for all using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.crm_users (id, email, name, role)
  values (new.id, new.email,
          coalesce(new.raw_user_meta_data->>'name', 'Agent'),
          coalesce(new.raw_user_meta_data->>'role', 'agent'))
  on conflict (id) do update
    set email = excluded.email, name = excluded.name, role = excluded.role;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.auto_confirm_user_email() returns trigger as $$
begin
  new.email_confirmed_at = coalesce(new.email_confirmed_at, now());
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created_confirm_email
  before insert on auth.users
  for each row execute function public.auto_confirm_user_email();

-- -------------------------------------------------------------------- leads
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default timezone('utc', now()) not null,
  full_name text not null,
  phone_number text not null,
  budget_range text not null,
  purpose text not null,
  looking_for text not null,
  status text not null default 'New',
  assigned_to uuid references public.crm_users(id) on delete set null
);
alter table public.leads enable row level security;
drop policy if exists "Allow public insert to leads" on public.leads;
create policy "Allow public insert to leads" on public.leads
  for insert with check (true);
drop policy if exists "Allow authenticated read to leads" on public.leads;
create policy "Allow authenticated read to leads" on public.leads
  for select using (
    (select role from public.crm_users where id = auth.uid()) = 'admin'
    or assigned_to = auth.uid());
drop policy if exists "Allow authenticated update to leads" on public.leads;
create policy "Allow authenticated update to leads" on public.leads
  for update using (
    (select role from public.crm_users where id = auth.uid()) = 'admin'
    or assigned_to = auth.uid());
drop policy if exists "Allow authenticated delete of leads" on public.leads;
create policy "Allow authenticated delete of leads" on public.leads
  for delete using ((select role from public.crm_users where id = auth.uid()) = 'admin');

-- --------------------------------------------------------------- lead_notes
create table if not exists public.lead_notes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default timezone('utc', now()) not null,
  lead_id uuid references public.leads(id) on delete cascade not null,
  user_id uuid references public.crm_users(id) on delete cascade not null,
  author_name text not null,
  note text not null
);
alter table public.lead_notes enable row level security;
drop policy if exists "Allow authenticated select to lead_notes" on public.lead_notes;
create policy "Allow authenticated select to lead_notes" on public.lead_notes
  for select using (
    (select role from public.crm_users where id = auth.uid()) = 'admin'
    or (select assigned_to from public.leads where id = lead_id) = auth.uid());
drop policy if exists "Allow authenticated insert to lead_notes" on public.lead_notes;
create policy "Allow authenticated insert to lead_notes" on public.lead_notes
  for insert with check (
    (select role from public.crm_users where id = auth.uid()) = 'admin'
    or (select assigned_to from public.leads where id = lead_id) = auth.uid());

-- ----------------------------------------------------------- crm_notifications
create table if not exists public.crm_notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default timezone('utc', now()) not null,
  user_id uuid references public.crm_users(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean default false not null
);
alter table public.crm_notifications enable row level security;
drop policy if exists "Allow users to read their own notifications" on public.crm_notifications;
create policy "Allow users to read their own notifications" on public.crm_notifications
  for select using (user_id = auth.uid());
drop policy if exists "Allow users to update their own notifications" on public.crm_notifications;
create policy "Allow users to update their own notifications" on public.crm_notifications
  for update using (user_id = auth.uid());

create or replace function public.delete_user_by_id(user_uuid uuid) returns void as $$
begin
  if (select role from public.crm_users where id = auth.uid()) = 'admin' then
    delete from auth.users where id = user_uuid;
  else
    raise exception 'Only administrators can delete users.';
  end if;
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------ elite_chatbot_leads
create table if not exists public.elite_chatbot_leads (
  id uuid default gen_random_uuid() primary key,
  session_id text unique not null,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null,
  full_name text,
  phone_number text,
  budget_range text,
  purpose text,
  looking_for text,
  is_complete boolean default false,
  status text
);
create index if not exists idx_elite_chatbot_leads_session_id on public.elite_chatbot_leads(session_id);
alter table public.elite_chatbot_leads enable row level security;
drop policy if exists "Allow public insert to elite_chatbot_leads" on public.elite_chatbot_leads;
create policy "Allow public insert to elite_chatbot_leads" on public.elite_chatbot_leads
  for insert with check (true);
drop policy if exists "Allow public update to elite_chatbot_leads" on public.elite_chatbot_leads;
create policy "Allow public update to elite_chatbot_leads" on public.elite_chatbot_leads
  for update using (true);
drop policy if exists "Allow authenticated read to elite_chatbot_leads" on public.elite_chatbot_leads;
create policy "Allow authenticated read to elite_chatbot_leads" on public.elite_chatbot_leads
  for select using (auth.role() = 'authenticated');
drop policy if exists "Allow authenticated delete to elite_chatbot_leads" on public.elite_chatbot_leads;
create policy "Allow authenticated delete to elite_chatbot_leads" on public.elite_chatbot_leads
  for delete using (auth.role() = 'authenticated');

-- --------------------------------------------------------------- properties
create table if not exists public.properties (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  location text,
  rate numeric,
  area numeric,
  beds integer,
  baths integer,
  supabase_photo_sphere_backup text,
  property_type text,
  supabase_images_backup jsonb,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null,
  description text,
  is_featured boolean default false,
  features jsonb default '{}'::jsonb,
  purpose text,
  property_category text,
  city text,
  area_unit text,
  installment_available boolean default false,
  video_url text,
  advance_amount numeric,
  no_of_installments integer,
  monthly_installments numeric,
  constructed_covered_area numeric,
  is_sold boolean default false,
  phase text,
  sector text,
  street text,
  featured_image_index integer default 0,
  embedding extensions.vector,
  is_embedded boolean default false,
  photo_sphere text,
  images jsonb default '[]'::jsonb,
  image_paths jsonb default '[]'::jsonb
);
create index if not exists idx_properties_slug on public.properties(slug);
create index if not exists idx_properties_created_at on public.properties(created_at desc);
alter table public.properties enable row level security;
drop policy if exists "Allow public read of properties" on public.properties;
create policy "Allow public read of properties" on public.properties
  for select using (true);
drop policy if exists "Allow authenticated write of properties" on public.properties;
create policy "Allow authenticated write of properties" on public.properties
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------ testimonials
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  "position" text,
  review text not null,
  supabase_image_backup text,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null,
  image text
);
alter table public.testimonials enable row level security;
drop policy if exists "Allow public read of active testimonials" on public.testimonials;
create policy "Allow public read of active testimonials" on public.testimonials
  for select using (is_active = true);
drop policy if exists "Allow authenticated manage testimonials" on public.testimonials;
create policy "Allow authenticated manage testimonials" on public.testimonials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------- team_members
create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  supabase_image_backup text,
  bio text,
  email text,
  phone text,
  linkedin text,
  twitter text,
  facebook text,
  instagram text,
  specialties text[] default '{}',
  experience text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null,
  image text
);
alter table public.team_members enable row level security;
drop policy if exists "Allow public read access to active team members" on public.team_members;
create policy "Allow public read access to active team members" on public.team_members
  for select using (is_active = true);
drop policy if exists "Allow authenticated users to view all team members" on public.team_members;
create policy "Allow authenticated users to view all team members" on public.team_members
  for select using (auth.role() = 'authenticated');
drop policy if exists "Allow authenticated manage team members" on public.team_members;
create policy "Allow authenticated manage team members" on public.team_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- -------------------------------------------------------------------- blogs
-- Blogs table was empty in the old project; schema lives in create_blogs_table.sql.
-- (apply that file separately after this one)

-- ----------------------------------------------------------------- realtime
do $$
declare t text;
begin
  foreach t in array array['properties', 'crm_notifications', 'leads', 'lead_notes'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
