-- Add color column to teams
alter table teams add column color text;

-- Update existing teams with colors (optional, but good for consistency if manual update needed)
-- (The seed script will handle the upsert with colors)
