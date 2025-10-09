-- Add is_public column to products table
-- Default value is FALSE (0) for new products

ALTER TABLE `products` 
ADD COLUMN `is_public` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_returnable`;

-- Add index for better query performance on is_public
ALTER TABLE `products`
ADD INDEX `idx_products_is_public` (`is_public`);

-- Update existing products to have is_public = false (default behavior)
-- This is redundant since we set DEFAULT 0, but explicit for clarity
UPDATE `products` SET `is_public` = 0 WHERE `is_public` IS NULL;
