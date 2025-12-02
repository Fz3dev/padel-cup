-- Insert Teams
insert into teams (id, name, category, members, color) values
  ('A', 'Guillaume / Maxence', 'explorateur', ARRAY['Guillaume', 'Maxence'], '#000000'),
  ('B', 'Cyril / Sandra', 'explorateur', ARRAY['Cyril', 'Sandra'], '#EF4444'),
  ('C', 'Emile / Aminata', 'explorateur', ARRAY['Emile', 'Aminata'], '#0EA5E9'),
  ('D', 'Alim / Manon', 'explorateur', ARRAY['Alim', 'Manon'], '#F472B6'),
  ('E', 'Fawsy / François N.', 'confirme', ARRAY['Fawsy', 'François N.'], '#FFFF00'),
  ('F', 'Nicolas / Pierre', 'confirme', ARRAY['Nicolas', 'Pierre'], '#22C55E'),
  ('G', 'Philippe / Marine', 'confirme', ARRAY['Philippe', 'Marine'], '#F97316'),
  ('H', 'Meyer / Clément', 'confirme', ARRAY['Meyer', 'Clément'], '#FFFFFF'),
  ('I', 'Laurent / François V.', 'confirme', ARRAY['Laurent', 'François V.'], '#A855F7'),
  ('J', 'Corentin / Johanne', 'confirme', ARRAY['Corentin', 'Johanne'], '#6B7280')
on conflict (id) do update set 
  name = excluded.name,
  category = excluded.category,
  members = excluded.members,
  color = excluded.color;
