-- Check if color column exists and add team colors
-- First check structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'teams' AND column_name = 'color';

-- Update teams with their official colors (based on the screenshot)
-- Team E (Fawsy) - Yellow
UPDATE teams SET color = '#DFFF00' WHERE id = 'E';

-- Team G (Philippe) - Purple/Blue 
UPDATE teams SET color = '#A78BFA' WHERE id = 'G';

-- Team H (Meyer) - Orange
UPDATE teams SET color = '#F97316' WHERE id = 'H';

-- Team I (Laurent) - Cyan
UPDATE teams SET color = '#06B6D4' WHERE id = 'I';

-- Team J (Corentin) - Green
UPDATE teams SET color = '#10B981' WHERE id = 'J';

-- Team F (Nicolas) - Pink
UPDATE teams SET color = '#EC4899' WHERE id = 'F';

-- If there are more teams, add them here
-- Team A
UPDATE teams SET color = '#3B82F6' WHERE id = 'A';

-- Team B  
UPDATE teams SET color = '#8B5CF6' WHERE id = 'B';

-- Team C
UPDATE teams SET color = '#EF4444' WHERE id = 'C';

-- Team D
UPDATE teams SET color = '#F59E0B' WHERE id = 'D';
