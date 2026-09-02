-- Product assignment for pb_tasks
-- Run this after database_pb_tasks_migration.sql
--
-- Links a task to a product in pb_products so the task screen can show
-- which product it belongs to, and the tasks list can filter by product.
-- ON DELETE SET NULL keeps tasks intact when a product is removed.

ALTER TABLE pb_tasks
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES pb_products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_pb_tasks_product_id ON pb_tasks(product_id);
