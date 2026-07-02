-- Day-of-week tracking migration for pb_tasks
-- Run this after database_pb_tasks_time_tracking_migration.sql
--
-- Stores the day of week on which the task was started and finished.
-- Free-form for now — the API layer enforces the allowed values so we can
-- add or rename days without a schema change.

ALTER TABLE pb_tasks
  ADD COLUMN IF NOT EXISTS start_day TEXT,
  ADD COLUMN IF NOT EXISTS end_day   TEXT;

-- Restrict to the seven day names. NULL means "not set yet".
ALTER TABLE pb_tasks
  DROP CONSTRAINT IF EXISTS pb_tasks_day_names_valid;

ALTER TABLE pb_tasks
  ADD CONSTRAINT pb_tasks_day_names_valid CHECK (
    (start_day IS NULL OR start_day IN
      ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'))
    AND
    (end_day IS NULL OR end_day IN
      ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'))
  );
