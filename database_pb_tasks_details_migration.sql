-- Ticket-details migration for pb_tasks
-- Adds Jira-style detail fields (PR link, approach, acceptance criteria,
-- repro steps) plus an attachments table backed by Supabase Storage.
--
-- Run this after database_pb_tasks_migration.sql.

------------------------------------------------------------
-- 1. Scalar detail fields on pb_tasks
------------------------------------------------------------
ALTER TABLE pb_tasks
  ADD COLUMN IF NOT EXISTS pr_url TEXT,
  ADD COLUMN IF NOT EXISTS approach TEXT,
  ADD COLUMN IF NOT EXISTS acceptance_criteria TEXT,
  ADD COLUMN IF NOT EXISTS repro_steps TEXT;

------------------------------------------------------------
-- 2. Attachments table
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pb_task_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES pb_tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,         -- object path inside the storage bucket
  file_url TEXT NOT NULL,          -- public URL for rendering
  mime_type TEXT,
  size_bytes BIGINT,
  uploaded_by TEXT,                -- assignee/user name; nullable for legacy uploads
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pb_task_attachments_task_id
  ON pb_task_attachments(task_id);

ALTER TABLE pb_task_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to pb_task_attachments" ON pb_task_attachments;
CREATE POLICY "Allow all access to pb_task_attachments" ON pb_task_attachments
  FOR ALL USING (true) WITH CHECK (true);

------------------------------------------------------------
-- 3. Storage bucket for uploaded screenshots/files
------------------------------------------------------------
-- Public bucket so file_url can be rendered directly.
INSERT INTO storage.buckets (id, name, public)
VALUES ('pb-task-attachments', 'pb-task-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Permissive policies matching the pb_tasks table policy above.
-- Tighten these once auth is wired through.
DROP POLICY IF EXISTS "pb_task_attachments_read" ON storage.objects;
CREATE POLICY "pb_task_attachments_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'pb-task-attachments');

DROP POLICY IF EXISTS "pb_task_attachments_insert" ON storage.objects;
CREATE POLICY "pb_task_attachments_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pb-task-attachments');

DROP POLICY IF EXISTS "pb_task_attachments_update" ON storage.objects;
CREATE POLICY "pb_task_attachments_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pb-task-attachments')
  WITH CHECK (bucket_id = 'pb-task-attachments');

DROP POLICY IF EXISTS "pb_task_attachments_delete" ON storage.objects;
CREATE POLICY "pb_task_attachments_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'pb-task-attachments');
