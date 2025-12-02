-- 1. Create a table to store email -> team mapping
-- We drop it first to ensure clean state if re-running
drop table if exists team_assignments;

create table team_assignments (
  email text primary key,
  team_id text references teams(id),
  role text default 'player' check (role in ('player', 'admin'))
);

-- 2. Enable RLS
alter table team_assignments enable row level security;
create policy "Admins can manage assignments" on team_assignments for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 3. Update the handle_new_user function to check for assignment
create or replace function public.handle_new_user() 
returns trigger as $$
declare
  assigned_team_id text;
  assigned_role text;
begin
  -- Check if there is a pre-assignment for this email
  select team_id, role into assigned_team_id, assigned_role
  from public.team_assignments
  where email = new.email;

  -- Default to player if no role found
  if assigned_role is null then
    assigned_role := 'player';
  end if;

  -- Insert profile with the assigned team and role
  insert into public.profiles (id, email, team_id, role)
  values (new.id, new.email, assigned_team_id, assigned_role);
  
  return new;
end;
$$ language plpgsql security definer;
