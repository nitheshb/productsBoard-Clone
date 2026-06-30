-- Time tracking migration for pb_tasks
-- Run this after database_pb_tasks_migration.sql

-- Estimated/actual stored as INTEGER minutes (workday = 8h convention)
-- to avoid floating-point precision issues and keep velocity/capacity math simple.
ALTER TABLE pb_tasks
  ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS actual_minutes INTEGER;

-- Sanity bounds. estimated_minutes is nullable for already-existing rows;
-- the API enforces "required on create" instead.
ALTER TABLE pb_tasks
  DROP CONSTRAINT IF EXISTS pb_tasks_estimated_minutes_positive;
ALTER TABLE pb_tasks
  ADD CONSTRAINT pb_tasks_estimated_minutes_positive
  CHECK (estimated_minutes IS NULL OR estimated_minutes > 0);

ALTER TABLE pb_tasks
  DROP CONSTRAINT IF EXISTS pb_tasks_actual_minutes_non_negative;
ALTER TABLE pb_tasks
  ADD CONSTRAINT pb_tasks_actual_minutes_non_negative
  CHECK (actual_minutes IS NULL OR actual_minutes >= 0);
