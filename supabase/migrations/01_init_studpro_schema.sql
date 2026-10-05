-- ==============================================================================
-- StudPro Platform: Initial PostgreSQL Relational Schema & Row-Level Security
-- Migration: 01_init_studpro_schema.sql
-- ==============================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. Tables Definition
-- ==============================================================================

-- Admin Profiles (Linked to Supabase Auth users with role-based access)
create table if not exists public.admin_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    full_name text,
    role text not null default 'editor' check (role in ('super_admin', 'editor')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- StudPro Annual Cycles (e.g., StudPro 6.0, StudPro 5.0)
create table if not exists public.studpro_cycles (
    id uuid primary key default uuid_generate_v4(),
    version text not null unique,
    year integer not null,
    description text,
    is_active boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Event Series (e.g., "Webinar Series", "Workshop Series" within a cycle)
create table if not exists public.event_series (
    id uuid primary key default uuid_generate_v4(),
    cycle_id uuid not null references public.studpro_cycles(id) on delete cascade,
    title text not null,
    description text,
    display_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- Events Master Table
create table if not exists public.events (
    id uuid primary key default uuid_generate_v4(),
    cycle_id uuid not null references public.studpro_cycles(id) on delete cascade,
    series_id uuid references public.event_series(id) on delete set null,
    category text not null check (category in ('career-fairs', 'cv-clinics', 'industry-visits', 'workshops', 'webinar')),
    title text not null,
    topic text,
    event_date date not null,
    time text,
    venue text,
    description text,
    images text[] not null default '{}',
    is_featured boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Event Speakers
create table if not exists public.speakers (
    id uuid primary key default uuid_generate_v4(),
    event_id uuid not null references public.events(id) on delete cascade,
    name text not null,
    title text,
    company text,
    avatar_url text,
    social_links text[] not null default '{}',
    created_at timestamptz not null default now()
);

-- Master Companies Catalog
create table if not exists public.companies (
    id text primary key, -- Slug identifier e.g. "dialog_axiata"
    name text not null,
    logo_url text not null,
    web_link text,
    created_at timestamptz not null default now()
);

-- Cycle Partners (Associates companies with annual StudPro cycles with tier level)
create table if not exists public.cycle_partners (
    id uuid primary key default uuid_generate_v4(),
    cycle_id uuid not null references public.studpro_cycles(id) on delete cascade,
    company_id text not null references public.companies(id) on delete cascade,
    tier text not null check (tier in ('Platinum', 'Gold', 'Silver', 'Bronze', 'Partner')),
    display_order integer not null default 0,
    created_at timestamptz not null default now(),
    unique (cycle_id, company_id)
);

-- Organizing Committee & Executive Team Members
create table if not exists public.team_members (
    id uuid primary key default uuid_generate_v4(),
    cycle_id uuid references public.studpro_cycles(id) on delete set null,
    name text not null,
    role text not null,
    email text,
    contact_no text,
    linkedin_url text,
    image_url text,
    display_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- ==============================================================================
-- 3. Indexes for High-Performance Queries
-- ==============================================================================
create index if not exists idx_events_category on public.events(category);
create index if not exists idx_events_cycle on public.events(cycle_id);
create index if not exists idx_events_date on public.events(event_date desc);
create index if not exists idx_speakers_event on public.speakers(event_id);
create index if not exists idx_cycle_partners_cycle on public.cycle_partners(cycle_id);
create index if not exists idx_team_members_order on public.team_members(display_order);

-- ==============================================================================
-- 4. Automatic Timestamp Update Triggers
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger tr_admin_profiles_updated_at before update on public.admin_profiles
    for each row execute function public.handle_updated_at();

create trigger tr_studpro_cycles_updated_at before update on public.studpro_cycles
    for each row execute function public.handle_updated_at();

create trigger tr_events_updated_at before update on public.events
    for each row execute function public.handle_updated_at();

-- ==============================================================================
-- 5. Row-Level Security (RLS) Policies
-- ==============================================================================

-- Helper function: Check if current auth user is a verified admin
create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.admin_profiles
        where id = auth.uid()
    );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table public.admin_profiles enable row level security;
alter table public.studpro_cycles enable row level security;
alter table public.event_series enable row level security;
alter table public.events enable row level security;
alter table public.speakers enable row level security;
alter table public.companies enable row level security;
alter table public.cycle_partners enable row level security;
alter table public.team_members enable row level security;

-- Admin Profiles Policies
create policy "Admins can view admin profiles" on public.admin_profiles
    for select using (public.is_admin());

create policy "Super admins can manage admin profiles" on public.admin_profiles
    for all using (
        exists (
            select 1 from public.admin_profiles
            where id = auth.uid() and role = 'super_admin'
        )
    );

-- Public Read Policies (Allow anyone to view published website data)
create policy "Public can view studpro cycles" on public.studpro_cycles for select using (true);
create policy "Public can view event series" on public.event_series for select using (true);
create policy "Public can view events" on public.events for select using (true);
create policy "Public can view speakers" on public.speakers for select using (true);
create policy "Public can view companies" on public.companies for select using (true);
create policy "Public can view cycle partners" on public.cycle_partners for select using (true);
create policy "Public can view team members" on public.team_members for select using (true);

-- Admin Mutation Policies (Strictly restricted to verified Admins)
create policy "Admins can insert studpro cycles" on public.studpro_cycles for insert with check (public.is_admin());
create policy "Admins can update studpro cycles" on public.studpro_cycles for update using (public.is_admin());
create policy "Admins can delete studpro cycles" on public.studpro_cycles for delete using (public.is_admin());

create policy "Admins can insert event series" on public.event_series for insert with check (public.is_admin());
create policy "Admins can update event series" on public.event_series for update using (public.is_admin());
create policy "Admins can delete event series" on public.event_series for delete using (public.is_admin());

create policy "Admins can insert events" on public.events for insert with check (public.is_admin());
create policy "Admins can update events" on public.events for update using (public.is_admin());
create policy "Admins can delete events" on public.events for delete using (public.is_admin());

create policy "Admins can insert speakers" on public.speakers for insert with check (public.is_admin());
create policy "Admins can update speakers" on public.speakers for update using (public.is_admin());
create policy "Admins can delete speakers" on public.speakers for delete using (public.is_admin());

create policy "Admins can insert companies" on public.companies for insert with check (public.is_admin());
create policy "Admins can update companies" on public.companies for update using (public.is_admin());
create policy "Admins can delete companies" on public.companies for delete using (public.is_admin());

create policy "Admins can insert cycle partners" on public.cycle_partners for insert with check (public.is_admin());
create policy "Admins can update cycle partners" on public.cycle_partners for update using (public.is_admin());
create policy "Admins can delete cycle partners" on public.cycle_partners for delete using (public.is_admin());

create policy "Admins can insert team members" on public.team_members for insert with check (public.is_admin());
create policy "Admins can update team members" on public.team_members for update using (public.is_admin());
create policy "Admins can delete team members" on public.team_members for delete using (public.is_admin());
