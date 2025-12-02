-- Update existing profiles from team_assignments
update profiles
set 
  team_id = ta.team_id,
  role = ta.role
from team_assignments ta
where profiles.email = ta.email;

-- If profiles are missing but users exist in auth.users, we can't easily insert them from here without more complex logic or manual intervention.
-- But usually the trigger creates the profile. If the profile exists but is empty, this update will fix it.

-- Let's also verify if there are any assignments that didn't get into profiles
select p.email, p.team_id, ta.team_id as should_be
from profiles p
join team_assignments ta on p.email = ta.email
where p.team_id is distinct from ta.team_id;
