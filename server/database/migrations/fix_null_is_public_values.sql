-- Fix NULL is_public values in products table
-- This migration ensures all products have a valid is_public value

-- Update any NULL is_public values to 0 (false/private)
UPDATE `products` 
SET `is_public` = 0 
WHERE `is_public` IS NULL;

-- Ensure the column is NOT NULL with default value
ALTER TABLE `products` 
MODIFY COLUMN `is_public` TINYINT(1) NOT NULL DEFAULT 0;

-- Verify the fix worked
SELECT COUNT(*) as null_count 
FROM `products` 
WHERE `is_public` IS NULL;
-- This should return 0 if the fix worked
