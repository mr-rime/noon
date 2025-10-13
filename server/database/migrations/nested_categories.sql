-- Migration: Convert to nested categories structure (up to 5 levels)
-- This replaces the separate categories/subcategories tables with a single self-referential table

-- Create new nested categories table
DROP TABLE IF EXISTS `categories_nested`;
CREATE TABLE `categories_nested` (
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

-- Migrate existing categories (level 0)
INSERT INTO `categories_nested` (`name`, `slug`, `description`, `level`, `path`, `is_active`)
SELECT 
    `name`,
    `slug`,
    `description`,
    0 as `level`,
    CONCAT('/', `category_id`, '/') as `path`,
    `is_active`
FROM `categories`;

-- Migrate existing subcategories (level 1)
INSERT INTO `categories_nested` (`parent_id`, `name`, `slug`, `description`, `level`, `path`, `is_active`)
SELECT 
    c.`category_id` as `parent_id`,
    s.`name`,
    s.`slug`,
    s.`description`,
    1 as `level`,
    CONCAT('/', c.`category_id`, '/', s.`subcategory_id`, '/') as `path`,
    s.`is_active`
FROM `subcategories` s
JOIN `categories` c ON s.`category_id` = c.`category_id`;

-- Create a function to get category breadcrumb
DELIMITER //
CREATE FUNCTION get_category_breadcrumb(cat_id INT)
RETURNS JSON
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE breadcrumb JSON;
    
    WITH RECURSIVE category_path AS (
        SELECT 
            category_id,
            parent_id,
            name,
            slug,
            level
        FROM categories_nested
        WHERE category_id = cat_id
        
        UNION ALL
        
        SELECT 
            c.category_id,
            c.parent_id,
            c.name,
            c.slug,
            c.level
        FROM categories_nested c
        INNER JOIN category_path cp ON c.category_id = cp.parent_id
    )
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', category_id,
            'name', name,
            'slug', slug,
            'level', level
        )
        ORDER BY level ASC
    ) INTO breadcrumb
    FROM category_path;
    
    RETURN breadcrumb;
END//
DELIMITER ;

-- Create a function to get all descendants of a category
DELIMITER //
CREATE FUNCTION get_category_descendants(cat_id INT)
RETURNS JSON
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE descendants JSON;
    
    WITH RECURSIVE category_tree AS (
        SELECT 
            category_id,
            parent_id,
            name,
            slug,
            level
        FROM categories_nested
        WHERE parent_id = cat_id
        
        UNION ALL
        
        SELECT 
            c.category_id,
            c.parent_id,
            c.name,
            c.slug,
            c.level
        FROM categories_nested c
        INNER JOIN category_tree ct ON c.parent_id = ct.category_id
    )
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', category_id,
            'parent_id', parent_id,
            'name', name,
            'slug', slug,
            'level', level
        )
    ) INTO descendants
    FROM category_tree;
    
    RETURN descendants;
END//
DELIMITER ;

-- Update products table to use new category structure
ALTER TABLE `products` 
DROP FOREIGN KEY IF EXISTS `fk_products_subcategory`,
DROP COLUMN IF EXISTS `subcategory_id`,
MODIFY COLUMN `category_id` INT,
ADD CONSTRAINT `fk_products_category_nested`
    FOREIGN KEY (`category_id`) REFERENCES `categories_nested`(`category_id`)
    ON DELETE SET NULL;

-- Update product_groups table
ALTER TABLE `product_groups`
DROP FOREIGN KEY IF EXISTS `fk_product_groups_subcategory`,
DROP COLUMN IF EXISTS `subcategory_id`,
ADD CONSTRAINT `fk_product_groups_category_nested`
    FOREIGN KEY (`category_id`) REFERENCES `categories_nested`(`category_id`)
    ON DELETE SET NULL;

-- Create view for easy category tree queries
CREATE OR REPLACE VIEW category_tree_view AS
WITH RECURSIVE category_tree AS (
    SELECT 
        c1.category_id,
        c1.parent_id,
        c1.name,
        c1.slug,
        c1.description,
        c1.level,
        c1.path,
        c1.display_order,
        c1.image_url,
        c1.icon_url,
        c1.is_active,
        CAST(c1.name AS CHAR(500)) as full_path_name,
        CAST(c1.slug AS CHAR(500)) as full_path_slug
    FROM categories_nested c1
    WHERE c1.parent_id IS NULL
    
    UNION ALL
    
    SELECT 
        c2.category_id,
        c2.parent_id,
        c2.name,
        c2.slug,
        c2.description,
        c2.level,
        c2.path,
        c2.display_order,
        c2.image_url,
        c2.icon_url,
        c2.is_active,
        CONCAT(ct.full_path_name, ' > ', c2.name) as full_path_name,
        CONCAT(ct.full_path_slug, '/', c2.slug) as full_path_slug
    FROM categories_nested c2
    INNER JOIN category_tree ct ON c2.parent_id = ct.category_id
)
SELECT * FROM category_tree;

-- Sample data for testing nested categories
INSERT INTO `categories_nested` (`parent_id`, `name`, `slug`, `level`, `path`, `display_order`) VALUES
-- Electronics & Mobiles (Root)
(NULL, 'Electronics & Mobiles', 'electronics-and-mobiles', 0, '/1/', 1),
-- Level 1 - Mobiles & Accessories
(1, 'Mobiles & Accessories', 'mobiles-and-accessories', 1, '/1/2/', 1),
-- Level 2 - Accessories
(2, 'Accessories', 'accessories', 2, '/1/2/3/', 1),
-- Level 3 - Chargers
(3, 'Chargers', 'chargers', 3, '/1/2/3/4/', 1),
-- Level 4 - Specific charger types
(4, 'Wall Chargers', 'wall-chargers', 4, '/1/2/3/4/5/', 1),
(4, 'Wireless Chargers', 'wireless-chargers', 4, '/1/2/3/4/6/', 2),
(4, 'Car Chargers', 'car-chargers', 4, '/1/2/3/4/7/', 3),
-- More accessories at Level 3
(3, 'Cases & Covers', 'cases-covers', 3, '/1/2/3/8/', 2),
(3, 'Screen Protectors', 'screen-protectors', 3, '/1/2/3/9/', 3),
(3, 'Data Cables', 'data-cables', 3, '/1/2/3/10/', 4),
(3, 'Power Banks', 'power-banks', 3, '/1/2/3/11/', 5),
(3, 'Car Mobile Holders', 'car-mobile-holders', 3, '/1/2/3/12/', 6),
(3, 'Mobile Lens & Lens Protectors', 'mobile-lens-protectors', 3, '/1/2/3/13/', 7),
(3, 'Phone Grips & Stands', 'phone-grips-stands', 3, '/1/2/3/14/', 8);

-- Drop old tables (uncomment when ready to complete migration)
-- DROP TABLE IF EXISTS `subcategories`;
-- DROP TABLE IF EXISTS `categories`;
-- RENAME TABLE `categories_nested` TO `categories`;
