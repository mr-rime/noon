-- Fix categories_nested table to use varchar(21) for category_id
-- Run this SQL script directly in your database

-- Step 1: Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Step 2: Check current table structure
DESCRIBE categories_nested;

-- Step 3: Add new category_id column as varchar(21)
ALTER TABLE categories_nested ADD COLUMN new_category_id VARCHAR(21) AFTER category_id;

-- Step 4: Generate simple IDs for existing categories (you can replace these with nanoid later)
-- For now, we'll use a simple pattern: cat_001, cat_002, etc.
SET @counter = 0;
UPDATE categories_nested 
SET new_category_id = CONCAT('cat_', LPAD((@counter := @counter + 1), 3, '0')) 
ORDER BY level ASC, category_id ASC;

-- Step 5: Create a mapping table to update parent references
CREATE TEMPORARY TABLE category_mapping AS
SELECT 
    category_id as old_id,
    new_category_id as new_id
FROM categories_nested;

-- Step 6: Update parent_id references using the mapping
UPDATE categories_nested c1
JOIN category_mapping cm ON c1.parent_id = cm.old_id
SET c1.parent_id = cm.new_id
WHERE c1.parent_id IS NOT NULL;

-- Step 7: Drop old primary key and foreign key constraints
ALTER TABLE categories_nested DROP PRIMARY KEY;
ALTER TABLE categories_nested DROP FOREIGN KEY IF EXISTS fk_categories_parent;

-- Step 8: Drop old category_id column and rename new one
ALTER TABLE categories_nested DROP COLUMN category_id;
ALTER TABLE categories_nested CHANGE new_category_id category_id VARCHAR(21) PRIMARY KEY;

-- Step 9: Update parent_id column type to varchar(21)
ALTER TABLE categories_nested MODIFY COLUMN parent_id VARCHAR(21) DEFAULT NULL;

-- Step 10: Add back foreign key constraint
ALTER TABLE categories_nested ADD CONSTRAINT fk_categories_parent 
    FOREIGN KEY (parent_id) REFERENCES categories_nested(category_id) ON DELETE CASCADE;

-- Step 11: Update path values to use new IDs
UPDATE categories_nested SET path = CONCAT('/', category_id, '/') WHERE parent_id IS NULL;

-- For nested categories, you'll need to update paths based on hierarchy
-- This is a simplified version - you may want to regenerate paths properly
UPDATE categories_nested c1
JOIN categories_nested c2 ON c1.parent_id = c2.category_id
SET c1.path = CONCAT(c2.path, c1.category_id, '/')
WHERE c1.parent_id IS NOT NULL;

-- Step 12: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Step 13: Clean up temporary table
DROP TEMPORARY TABLE category_mapping;

-- Step 14: Show the updated table structure
DESCRIBE categories_nested;

-- Step 15: Show some sample data
SELECT category_id, parent_id, name, level, path FROM categories_nested ORDER BY level, category_id LIMIT 10;
