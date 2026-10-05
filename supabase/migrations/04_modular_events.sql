-- ==============================================================================
-- Migration 04: Modular Events Architecture
-- Supports:
--   1. Delivery modes (Physical, Online, Hybrid) with location/meeting URLs
--   2. Multi-speaker repeater support (0, 1, or N speakers)
--   3. Multi-company partner associations (0, 1, or N companies per event)
--   4. Series milestone progression (stage name & order e.g. Young Protegé)
-- ==============================================================================

-- 1. Extend public.events with delivery format and series stage metadata
alter table public.events 
    add column if not exists delivery_mode text not null default 'physical',
    add column if not exists meeting_url text,
    add column if not exists map_url text,
    add column if not exists series_stage text,
    add column if not exists series_order integer not null default 1;

-- Add check constraint safely if not present
do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'events_delivery_mode_check'
    ) then
        alter table public.events 
            add constraint events_delivery_mode_check 
            check (delivery_mode in ('physical', 'online', 'hybrid'));
    end if;
end $$;

-- 2. Add display_order to speakers table for multi-speaker sequencing
alter table public.speakers
    add column if not exists display_order integer not null default 0;

-- 3. Create event_companies junction table
create table if not exists public.event_companies (
    event_id uuid not null references public.events(id) on delete cascade,
    company_id text not null references public.companies(id) on delete cascade,
    role text not null default 'Partner',
    display_order integer not null default 0,
    created_at timestamptz not null default now(),
    primary key (event_id, company_id)
);

-- 4. Enable Row Level Security
alter table public.event_companies enable row level security;

-- 5. RLS Policies for event_companies (Drop if exists then create)
do $$
begin
    drop policy if exists "Public can view event companies" on public.event_companies;
    drop policy if exists "Admins can insert event companies" on public.event_companies;
    drop policy if exists "Admins can update event companies" on public.event_companies;
    drop policy if exists "Admins can delete event companies" on public.event_companies;
end $$;

create policy "Public can view event companies" 
    on public.event_companies for select using (true);

create policy "Admins can insert event companies" 
    on public.event_companies for insert with check (public.is_admin());

create policy "Admins can update event companies" 
    on public.event_companies for update using (public.is_admin());

create policy "Admins can delete event companies" 
    on public.event_companies for delete using (public.is_admin());

-- 6. High-Performance Indexes
create index if not exists idx_event_companies_event on public.event_companies(event_id);
create index if not exists idx_event_companies_company on public.event_companies(company_id);
create index if not exists idx_speakers_event on public.speakers(event_id);
create index if not exists idx_events_series_order on public.events(series_id, series_order);
