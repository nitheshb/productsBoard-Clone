-- Auth migration for pb_employees.
-- Adds the columns needed to link an existing team-member row to a
-- Firebase Auth account (shared with caco-hr) without touching any of
-- the existing name-keyed data (tasks, reviews, calendar, filters).
--
-- Run this once in the Supabase SQL editor.

ALTER TABLE pb_employees
  ADD COLUMN IF NOT EXISTS firebase_uid TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Partial unique indexes: allow many NULLs (rows we haven't linked yet)
-- but forbid two rows from claiming the same Firebase account or email.
CREATE UNIQUE INDEX IF NOT EXISTS pb_employees_firebase_uid_key
  ON pb_employees (firebase_uid)
  WHERE firebase_uid IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS pb_employees_email_key
  ON pb_employees (LOWER(email))
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pb_employees_firebase_uid
  ON pb_employees (firebase_uid);
