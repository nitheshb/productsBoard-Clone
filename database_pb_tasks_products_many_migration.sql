-- Multi-product assignment for pb_tasks
-- Run this after database_pb_tasks_product_migration.sql
--
-- A task can belong to more than one product. Existing single
-- product_id values are copied into this join table.

CREATE TABLE IF NOT EXISTS pb_task_products (
  task_id UUID NOT NULL REFERENCES pb_tasks(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES pb_products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (task_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_pb_task_products_product_id
  ON pb_task_products(product_id);

ALTER TABLE pb_task_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to pb_task_products" ON pb_task_products;
CREATE POLICY "Allow all access to pb_task_products" ON pb_task_products
  FOR ALL USING (true) WITH CHECK (true);

INSERT INTO pb_task_products (task_id, product_id)
SELECT id, product_id
FROM pb_tasks
WHERE product_id IS NOT NULL
ON CONFLICT (task_id, product_id) DO NOTHING;
