-- Add timer fields to matches table
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS timer_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS timer_paused_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS timer_total_paused_ms INT DEFAULT 0;
