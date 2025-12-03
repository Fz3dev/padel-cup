-- Reset all match scores
UPDATE matches 
SET 
  score_team1 = NULL,
  score_team2 = NULL,
  is_finished = false,
  submitted_by = NULL,
  timer_started_at = NULL,
  timer_paused_at = NULL,
  timer_total_paused_ms = NULL;
