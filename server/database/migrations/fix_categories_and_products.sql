-- Fix script to ensure database is properly set up for nested categories

-- First, check if categories_nested table exists, if not create it
CREATE TABLE IF NOT EXISTS `categories_nested` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `parent_id` INT DEFAULT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `description` TEXT,
    `level` INT NOT NULL DEFAULT 0,  -- 0 for root, 1-4 for nested levels
    `path` TEXT,  -- Store the full path like /1/5/12/ for quick ancestor queries
    `display_order` INT DEFAULT 0,
    `image_url` TEXT,  -- For category images in carousel
    `icon_url` TEXT,   -- For category icons
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_categories_parent`
        FOREIGN KEY (`parent_id`) REFERENCES `categories_nested`(`category_id`)
        ON DELETE CASCADE,
    
    -- Ensure level doesn't exceed 4 (0-4 = 5 levels total)
    CONSTRAINT `chk_category_level` CHECK (`level` >= 0 AND `level` <= 4),
    
    -- Composite unique key for slug within same parent
    UNIQUE KEY `uniq_parent_slug` (`parent_id`, `slug`),
    
    INDEX `idx_categories_parent` (`parent_id`),
    INDEX `idx_categories_slug` (`slug`),
    INDEX `idx_categories_level` (`level`),
    INDEX `idx_categories_active` (`is_active`),
    INDEX `idx_categories_order` (`display_order`),
    INDEX `idx_categories_path` (`path`(255))
);

-- Check if products table has subcategory_id and remove it
SET @column_exists = 0;
SELECT COUNT(*) INTO @column_exists 
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
AND table_name = 'products' 
AND column_name = 'subcategory_id';

SET @sql = IF(@column_exists > 0, 
    'ALTER TABLE products DROP FOREIGN KEY IF EXISTS fk_products_subcategory, DROP COLUMN subcategory_id',
    'SELECT "subcategory_id column does not exist"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if product_groups table has subcategory_id and remove it
SET @column_exists = 0;
SELECT COUNT(*) INTO @column_exists 
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
AND table_name = 'product_groups' 
AND column_name = 'subcategory_id';

SET @sql = IF(@column_exists > 0, 
    'ALTER TABLE product_groups DROP FOREIGN KEY IF EXISTS fk_product_groups_subcategory, DROP COLUMN subcategory_id',
    'SELECT "subcategory_id column does not exist in product_groups"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure products table has proper foreign key to categories_nested
ALTER TABLE `products` 
    DROP FOREIGN KEY IF EXISTS `fk_products_category`,
    DROP FOREIGN KEY IF EXISTS `fk_products_category_nested`;

ALTER TABLE `products`
    ADD CONSTRAINT `fk_products_category_nested`
    FOREIGN KEY (`category_id`) REFERENCES `categories_nested`(`category_id`)
    ON DELETE SET NULL;

-- Ensure product_groups table has proper foreign key to categories_nested
ALTER TABLE `product_groups`
    DROP FOREIGN KEY IF EXISTS `fk_product_groups_category`,
    DROP FOREIGN KEY IF EXISTS `fk_product_groups_category_nested`;

ALTER TABLE `product_groups`
    ADD CONSTRAINT `fk_product_groups_category_nested`
    FOREIGN KEY (`category_id`) REFERENCES `categories_nested`(`category_id`)
    ON DELETE SET NULL;

-- Insert sample nested categories if the table is empty
INSERT IGNORE INTO `categories_nested` (`category_id`, `parent_id`, `name`, `slug`, `level`, `path`, `display_order`) VALUES
-- Electronics & Mobiles (Root)
(1, NULL, 'Electronics & Mobiles', 'electronics-and-mobiles', 0, '/1/', 1),
-- Level 1 - Mobiles & Accessories
(2, 1, 'Mobiles & Accessories', 'mobiles-and-accessories', 1, '/1/2/', 1),
-- Level 2 - Accessories
(3, 2, 'Accessories', 'accessories', 2, '/1/2/3/', 1),
-- Level 3 - Chargers
(4, 3, 'Chargers', 'chargers', 3, '/1/2/3/4/', 1),
-- Level 4 - Specific charger types
(5, 4, 'Wall Chargers', 'wall-chargers', 4, '/1/2/3/4/5/', 1),
(6, 4, 'Wireless Chargers', 'wireless-chargers', 4, '/1/2/3/4/6/', 2),
(7, 4, 'Car Chargers', 'car-chargers', 4, '/1/2/3/4/7/', 3),
-- More accessories at Level 3
(8, 3, 'Cases & Covers', 'cases-covers', 3, '/1/2/3/8/', 2),
-- Level 2 - Mobiles
(9, 2, 'Mobiles', 'mobiles', 2, '/1/2/9/', 2),
-- Level 3 - Mobile brands
(10, 9, 'Samsung', 'samsung-mobiles', 3, '/1/2/9/10/', 1),
(11, 9, 'Apple', 'apple-mobiles', 3, '/1/2/9/11/', 2);

-- Verify the structure
SELECT 
    CONCAT(REPEAT('  ', level), name) as hierarchy,
    category_id,
    parent_id,
    level,
    path
FROM categories_nested
ORDER BY path;
