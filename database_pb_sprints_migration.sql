-- Sprints table migration for ProductBoard Clone
-- Run this script in your Supabase SQL editor after database_pb_tasks_migration.sql

CREATE TABLE IF NOT EXISTS pb_sprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT pb_sprints_date_check CHECK (end_date >= start_date),
  CONSTRAINT pb_sprints_status_check CHECK (status IN ('Upcoming', 'Active', 'Completed'))
);

CREATE INDEX IF NOT EXISTS idx_pb_sprints_status ON pb_sprints(status);
CREATE INDEX IF NOT EXISTS idx_pb_sprints_start_date ON pb_sprints(start_date);

ALTER TABLE pb_sprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to pb_sprints" ON pb_sprints
  FOR ALL USING (true) WITH CHECK (true);

-- Add sprint_id foreign key to pb_tasks so tasks can be assigned to a sprint.
-- ON DELETE SET NULL keeps tasks intact when a sprint is removed.
ALTER TABLE pb_tasks
  ADD COLUMN IF NOT EXISTS sprint_id UUID REFERENCES pb_sprints(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_pb_tasks_sprint_id ON pb_tasks(sprint_id);
