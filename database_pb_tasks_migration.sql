-- Tasks table migration for ProductBoard Clone
-- Run this script in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS pb_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_key TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT,
  issue_type TEXT NOT NULL DEFAULT 'Task',
  status TEXT NOT NULL DEFAULT 'To Do',
  priority TEXT NOT NULL DEFAULT 'Medium',
  assignee TEXT NOT NULL,
  assignee_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pb_tasks_assignee ON pb_tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_pb_tasks_status ON pb_tasks(status);
CREATE INDEX IF NOT EXISTS idx_pb_tasks_ticket_key ON pb_tasks(ticket_key);

-- Enable RLS (adjust policies as needed for your auth setup)
ALTER TABLE pb_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to pb_tasks" ON pb_tasks
  FOR ALL USING (true) WITH CHECK (true);
