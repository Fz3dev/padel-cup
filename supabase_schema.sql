-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TEAMS TABLE
create table teams (
  id text primary key, -- 'A', 'B', etc.
  name text not null,
  members text[] not null,
  category text check (category in ('explorateur', 'confirme')) not null,
  created_at timestamptz default now()
);

-- 2. MATCHES TABLE
create table matches (
  id uuid primary key default uuid_generate_v4(),
  category text check (category in ('explorateur', 'confirme')) not null,
  terrain int not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes int not null,
  team1_id text references teams(id) not null,
  team2_id text references teams(id) not null,
  score_team1 int,
  score_team2 int,
  is_finished boolean default false,
  submitted_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 3. PROFILES TABLE (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  team_id text references teams(id),
  role text check (role in ('player', 'admin')) default 'player',
  created_at timestamptz default now()
);

-- RLS POLICIES

-- Teams: Public read
alter table teams enable row level security;
create policy "Teams are viewable by everyone" on teams for select using (true);

-- Matches: Public read, Update by involved players or admin
alter table matches enable row level security;
create policy "Matches are viewable by everyone" on matches for select using (true);

create policy "Players can update their own matches" on matches for update using (
  auth.uid() in (
    select id from profiles where team_id = matches.team1_id or team_id = matches.team2_id
  )
);

create policy "Admins can update all matches" on matches for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Profiles: Read own, Admin read all
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- FUNCTION TO HANDLE NEW USER SIGNUP
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
