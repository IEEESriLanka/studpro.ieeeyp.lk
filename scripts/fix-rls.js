const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL environment variable is required to run this script.');
  console.error('Add DATABASE_URL to your .env.local file:');
  console.error('DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('Connecting to Supabase PostgreSQL database...');
  await client.connect();
  console.log('Connected!');

  const sql = `
    -- 1. Drop recursive policies on admin_profiles
    DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
    DROP POLICY IF EXISTS "Super admins can manage admin profiles" ON public.admin_profiles;
    DROP POLICY IF EXISTS "Users can view own admin profile" ON public.admin_profiles;
    DROP POLICY IF EXISTS "Super admins manage admin profiles" ON public.admin_profiles;

    -- 2. Create non-recursive policy for users to view their own profile
    CREATE POLICY "Users can view own admin profile" ON public.admin_profiles
      FOR SELECT USING (id = auth.uid());

    -- 3. Super admin management policy
    CREATE POLICY "Super admins manage admin profiles" ON public.admin_profiles
      FOR ALL USING (
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'super_admin'
        OR id = auth.uid()
      );

    -- 4. Recreate is_admin() with SECURITY INVOKER and isolated search_path
    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS boolean AS $$
    DECLARE
      v_role text;
    BEGIN
      -- Fast check on JWT app_metadata and user metadata
      v_role := COALESCE(
        auth.jwt() -> 'app_metadata' ->> 'role',
        auth.jwt() -> 'user_metadata' ->> 'role'
      );
      IF v_role IN ('super_admin', 'editor') THEN
        RETURN true;
      END IF;

      -- Check database record
      RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'editor')
      );
    END;
    $$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_catalog;
  `;

  await client.query(sql);
  console.log('✅ PostgreSQL RLS policies and is_admin() fixed successfully!');
  await client.end();
}

main().catch(err => {
  console.error('Error applying SQL fix:', err.message);
  process.exit(1);
});
