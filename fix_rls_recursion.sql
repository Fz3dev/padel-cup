-- Drop existing policies on profiles to be safe
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

-- Redefine policies to avoid recursion
-- Everyone can view profiles (needed for leaderboard, matches, etc.)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Users can insert their own profile
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- Users can update their own profile
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Fix team_assignments policies as well if they are causing issues
drop policy if exists "Admins can manage team assignments" on team_assignments;
drop policy if exists "Everyone can view team assignments" on team_assignments;

-- Everyone can view assignments
create policy "Everyone can view team assignments"
  on team_assignments for select
  using ( true );

-- Only admins can insert/update/delete
-- To avoid recursion, we should NOT query the profiles table inside the policy if the profiles table policy queries team_assignments.
-- Instead, we can trust the JWT metadata or use a simpler check. 
-- However, for now, let's just allow read access to everyone (which is safe for this app) and restrict write.

-- For write access, we need to check if the user is an admin.
-- If is_admin() queries profiles, and profiles is protected, we get recursion.
-- Let's redefine is_admin to be safer or just use a direct check.

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1
    from team_assignments
    where email = (select email from auth.users where id = auth.uid())
    and role = 'admin'
  );
$$ language sql security definer;

-- Now the policy for team_assignments
create policy "Admins can manage team assignments"
  on team_assignments
  for all
  using ( is_admin() );
