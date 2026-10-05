-- ==============================================================================
-- StudPro Platform: Supabase Advisor Warnings Remediation
-- Migration: 03_remediate_advisor_warnings.sql
-- Resolves:
--   - 0029: authenticated_security_definer_function_executable (public.is_admin)
--   - Non-recursive RLS policy on public.admin_profiles
-- ==============================================================================

-- 1. Ensure public.admin_profiles has non-recursive self-read and admin read policy
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

-- 2. Convert public.is_admin() from SECURITY DEFINER to SECURITY INVOKER
-- Eliminates Supabase Advisor warning 0029 (authenticated_security_definer_function_executable)
create or replace function public.is_admin()
returns boolean as $$
declare
    v_role text;
begin
    -- 1. Fast check on JWT app_metadata (tamper-proof) then user_metadata
    v_role := coalesce(
        auth.jwt() -> 'app_metadata' ->> 'role',
        auth.jwt() -> 'user_metadata' ->> 'role'
    );
    if v_role in ('super_admin', 'editor') then
        return true;
    end if;

    -- 2. Database verification against admin_profiles using invoker permissions
    return exists (
        select 1 from public.admin_profiles
        where id = auth.uid()
          and role in ('super_admin', 'editor')
    );
end;
$$ language plpgsql security invoker set search_path = public, pg_catalog;

-- 3. Maintain restricted execution privileges
revoke execute on function public.is_admin() from public;
revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated, service_role;
