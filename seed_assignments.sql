-- Insert assignments
insert into team_assignments (email, team_id, role) values
  -- ADMIN
  ('louis.pasquier@stoneo.fr', null, 'admin'),

  -- Team A
  ('guillaume.pigeon@avest.fr', 'A', 'player'),
  ('maxence.fourrier@avest.fr', 'A', 'player'),
  
  -- Team B
  ('cyril.lacheretz@avest.fr', 'B', 'player'),
  ('sandra.maglott@stoneo.fr', 'B', 'player'),
  
  -- Team C
  ('emile.bron@avest.fr', 'C', 'player'),
  ('aminata.sylla@stoneo.fr', 'C', 'player'),
  
  -- Team D
  ('alim.tunc@avest.fr', 'D', 'player'),
  ('manon.geslin@stoneo.fr', 'D', 'player'),
  
  -- Team E
  ('fawsy.limlahi@avest.fr', 'E', 'player'),
  ('francois.nicol@stoneo.fr', 'E', 'player'),
  
  -- Team F
  ('nicolas.poupard@stoneo.fr', 'F', 'player'),
  ('pierre.arthus@stoneo.fr', 'F', 'player'),
  
  -- Team G
  ('philippe.pluyette@avest.fr', 'G', 'player'),
  ('marine.huvier@stoneo.fr', 'G', 'player'),
  
  -- Team H
  ('meyer.attal@avest.fr', 'H', 'player'),
  ('clement.garo@avest.fr', 'H', 'player'),
  
  -- Team I
  ('laurent.fedida@stoneo.fr', 'I', 'player'),
  ('francois.vandamme@stoneo.fr', 'I', 'player'),
  
  -- Team J
  ('corentin.gillet@stoneo.fr', 'J', 'player'),
  ('johanne.perre@stoneo.fr', 'J', 'player')

on conflict (email) do update set 
  team_id = excluded.team_id,
  role = excluded.role;
