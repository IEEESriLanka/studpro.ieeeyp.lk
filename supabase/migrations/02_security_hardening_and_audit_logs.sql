-- ==============================================================================
-- StudPro Platform: Security Hardening & Audit Logging Migration
-- Migration: 02_security_hardening_and_audit_logs.sql
-- Resolves Supabase Security Advisor warnings:
--   - 0011: function_search_path_mutable (handle_updated_at, is_admin)
--   - 0028: anon_security_definer_function_executable (is_admin, rls_auto_enable)
--   - 0029: authenticated_security_definer_function_executable
-- ==============================================================================

-- 1. Fix mutable search_path on public.handle_updated_at()
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql set search_path = public, pg_catalog;

-- 2. Fix mutable search_path and execution privileges on public.is_admin()
create or replace function public.is_admin()
returns boolean as $$
declare
    v_role text;
begin
    -- Fast check on JWT app_metadata (tamper-proof) then user_metadata
    v_role := coalesce(
        auth.jwt() -> 'app_metadata' ->> 'role',
        auth.jwt() -> 'user_metadata' ->> 'role'
    );
    if v_role in ('super_admin', 'editor') then
        return true;
    end if;

    -- Strict database verification against admin_profiles table
    return exists (
        select 1 from public.admin_profiles
        where id = auth.uid()
          and role in ('super_admin', 'editor')
    );
end;
$$ language plpgsql security invoker set search_path = public, pg_catalog;

-- Revoke direct RPC execution of is_admin from anonymous/public callers
revoke execute on function public.is_admin() from public;
revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- Ensure public.admin_profiles has non-recursive select policy for invoker execution
drop policy if exists "Admins can view admin profiles" on public.admin_profiles;
drop policy if exists "Users can view own admin profile" on public.admin_profiles;
create policy "Admins can view admin profiles" on public.admin_profiles
    for select using (
        id = auth.uid()
        or coalesce(
            auth.jwt() -> 'app_metadata' ->> 'role',
            auth.jwt() -> 'user_metadata' ->> 'role'
        ) in ('super_admin', 'editor')
    );

-- 3. Fix rls_auto_enable if it exists in schema
do $$
begin
    if exists (select 1 from pg_proc where proname = 'rls_auto_enable') then
        execute 'alter function public.rls_auto_enable() set search_path = public, pg_catalog';
        execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
        execute 'grant execute on function public.rls_auto_enable() to service_role';
    end if;
end $$;

-- ==============================================================================
-- 4. Centralized Security Audit Logs Table
-- ==============================================================================
create table if not exists public.audit_logs (
    id uuid primary key default uuid_generate_v4(),
    actor_id uuid references auth.users(id) on delete set null,
    actor_email text,
    actor_role text,
    action text not null, -- e.g. 'auth.login.success', 'event.created', 'admin.role_changed'
    category text not null check (category in ('AUTH', 'SECURITY', 'DATA_MUTATION', 'SYSTEM')),
    severity text not null default 'INFO' check (severity in ('INFO', 'WARN', 'CRITICAL')),
    details jsonb not null default '{}'::jsonb,
    ip_address text,
    user_agent text,
    created_at timestamptz not null default now()
);

-- High-performance indexes for log querying and filtering
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_category on public.audit_logs(category);
create index if not exists idx_audit_logs_action on public.audit_logs(action);
create index if not exists idx_audit_logs_severity on public.audit_logs(severity);

-- Enable Row-Level Security on audit_logs
alter table public.audit_logs enable row level security;

-- Drop policies if exist to guarantee 100% idempotent execution
drop policy if exists "Admins can view audit logs" on public.audit_logs;
create policy "Admins can view audit logs" on public.audit_logs
    for select using (public.is_admin());

drop policy if exists "Service role and admins can insert audit logs" on public.audit_logs;
create policy "Service role and admins can insert audit logs" on public.audit_logs
    for insert with check (
        auth.role() = 'service_role' or public.is_admin()
    );
