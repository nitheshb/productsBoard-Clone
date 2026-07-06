-- Sprint reviews migration for ProductBoard Clone
-- Run this in your Supabase SQL editor.
--
-- Stores one review per (sprint, assignee). Each assignee reflects on their
-- work for a given sprint: what they did, what blocked them, and how they
-- plan to improve. Task counts (assigned / done / pending) are derived on
-- the fly from pb_tasks — not persisted here — so the review always
-- reflects the current state of tasks.

CREATE TABLE IF NOT EXISTS pb_sprint_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sprint_id UUID NOT NULL REFERENCES pb_sprints(id) ON DELETE CASCADE,
  assignee TEXT NOT NULL,
  what_did TEXT,
  blockers TEXT,
  improvements TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT pb_sprint_reviews_unique_per_person UNIQUE (sprint_id, assignee)
);

CREATE INDEX IF NOT EXISTS idx_pb_sprint_reviews_sprint ON pb_sprint_reviews(sprint_id);
CREATE INDEX IF NOT EXISTS idx_pb_sprint_reviews_assignee ON pb_sprint_reviews(assignee);

ALTER TABLE pb_sprint_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to pb_sprint_reviews" ON pb_sprint_reviews;
CREATE POLICY "Allow all access to pb_sprint_reviews" ON pb_sprint_reviews
  FOR ALL USING (true) WITH CHECK (true);
