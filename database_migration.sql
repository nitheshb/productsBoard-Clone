-- Database Migration Script for Version Progress Feature
-- Run this script in your Supabase database

-- Add version_progress column to components table (JSONB array of version and progress)
ALTER TABLE components 
ADD COLUMN IF NOT EXISTS version_progress JSONB DEFAULT '[]';

-- Add version_progress column to products table (JSONB array of version and progress)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS version_progress JSONB DEFAULT '[]';

-- Create GIN indexes for efficient JSONB querying
CREATE INDEX IF NOT EXISTS idx_components_version_progress ON components USING GIN(version_progress);
CREATE INDEX IF NOT EXISTS idx_products_version_progress ON products USING GIN(version_progress);

-- Initialize version_progress for existing components
UPDATE components 
SET version_progress = jsonb_build_array(
  jsonb_build_object('version', COALESCE(version, '1.0.0'), 'progress', COALESCE(progress, 0))
)
WHERE version_progress IS NULL OR version_progress = '[]';

-- Initialize version_progress for existing products
UPDATE products 
SET version_progress = jsonb_build_array(
  jsonb_build_object('version', COALESCE(version, '1.0.0'), 'progress', COALESCE(progress, 0))
)
WHERE version_progress IS NULL OR version_progress = '[]';

-- Verify the changes
SELECT 'Components with version_progress:' as info, COUNT(*) as count 
FROM components 
WHERE version_progress IS NOT NULL AND version_progress != '[]';

SELECT 'Products with version_progress:' as info, COUNT(*) as count 
FROM products 
WHERE version_progress IS NOT NULL AND version_progress != '[]'; 