-- Migration: Update categories to use varchar(21) IDs with nanoid generation
-- This updates all category-related tables to use string IDs instead of integer IDs

-- Step 1: Create temporary tables with new structure
CREATE TABLE `categories_nested_temp` (
    `category_id` VARCHAR(21) PRIMARY KEY,
    `parent_id` VARCHAR(21) DEFAULT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `description` TEXT,
    `level` INT NOT NULL DEFAULT 0,
    `path` TEXT,
    `display_order` INT DEFAULT 0,
    `image_url` TEXT,
    `icon_url` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_categories_parent_temp`
        FOREIGN KEY (`parent_id`) REFERENCES `categories_nested_temp`(`category_id`)
        ON DELETE CASCADE,
    
    CONSTRAINT `chk_category_level_temp` CHECK (`level` >= 0 AND `level` <= 4),
    
    UNIQUE KEY `uniq_parent_slug_temp` (`parent_id`, `slug`),
    
    INDEX `idx_categories_parent_temp` (`parent_id`),
    INDEX `idx_categories_slug_temp` (`slug`),
    INDEX `idx_categories_level_temp` (`level`),
    INDEX `idx_categories_active_temp` (`is_active`),
    INDEX `idx_categories_order_temp` (`display_order`),
    INDEX `idx_categories_path_temp` (`path`(255))
);

-- Step 2: Create temporary products table
CREATE TABLE `products_temp` (
    `id` VARCHAR(21) PRIMARY KEY,
    `psku` VARCHAR(100) UNIQUE,
    `group_id` VARCHAR(21),
    `brand_id` INT,
    `user_id` INT,
    `store_id` INT,
    `name` VARCHAR(500),
    `price` DECIMAL(10,2),
    `currency` VARCHAR(4),
    `product_overview` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `category_id` VARCHAR(21),
    `subcategory_id` VARCHAR(21),
    `stock` INT,
    `is_returnable` TINYINT(1),
    `is_public` TINYINT(1),
    `final_price` FLOAT,
    
    CONSTRAINT `fk_products_group_temp`
        FOREIGN KEY (`group_id`) REFERENCES `product_groups`(`group_id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_products_brand_temp`
        FOREIGN KEY (`brand_id`) REFERENCES `brands`(`brand_id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_products_category_nested_temp`
        FOREIGN KEY (`category_id`) REFERENCES `categories_nested_temp`(`category_id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_products_subcategory_temp`
        FOREIGN KEY (`subcategory_id`) REFERENCES `categories_nested_temp`(`category_id`)
        ON DELETE SET NULL,
    
    INDEX `idx_products_psku_temp` (`psku`),
    INDEX `idx_products_group_temp` (`group_id`),
    INDEX `idx_products_brand_temp` (`brand_id`),
    INDEX `idx_products_category_temp` (`category_id`),
    INDEX `idx_products_subcategory_temp` (`subcategory_id`),
    INDEX `idx_products_store_temp` (`store_id`),
    INDEX `idx_products_is_public_temp` (`is_public`)
);

-- Step 3: Create temporary product_groups table
CREATE TABLE `product_groups_temp` (
    `group_id` VARCHAR(21) PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `category_id` VARCHAR(21),
    `brand_id` INT,
    `attributes` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_product_groups_category_temp`
        FOREIGN KEY (`category_id`) REFERENCES `categories_nested_temp`(`category_id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_product_groups_brand_temp`
        FOREIGN KEY (`brand_id`) REFERENCES `brands`(`brand_id`)
        ON DELETE SET NULL,
    
    INDEX `idx_product_groups_category_temp` (`category_id`),
    INDEX `idx_product_groups_brand_temp` (`brand_id`)
);

-- Step 4: Create temporary subcategories table (if it exists)
CREATE TABLE `subcategories_temp` (
    `subcategory_id` VARCHAR(21) PRIMARY KEY,
    `category_id` VARCHAR(21) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) UNIQUE NOT NULL,
    `description` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_subcategories_category_temp`
        FOREIGN KEY (`category_id`) REFERENCES `categories_nested_temp`(`category_id`)
        ON DELETE CASCADE,
    
    INDEX `idx_subcategories_category_temp` (`category_id`),
    INDEX `idx_subcategories_slug_temp` (`slug`),
    INDEX `idx_subcategories_active_temp` (`is_active`)
);

-- Step 5: Create mapping table for old to new IDs
CREATE TABLE `category_id_mapping` (
    `old_id` INT PRIMARY KEY,
    `new_id` VARCHAR(21) NOT NULL,
    INDEX `idx_mapping_new_id` (`new_id`)
);

-- Step 6: Generate new nanoid-based IDs for categories and insert into temp table
-- Note: This will be done by PHP script, not SQL
-- The PHP script will:
-- 1. Read all categories from categories_nested
-- 2. Generate new nanoid for each category
-- 3. Insert mapping into category_id_mapping
-- 4. Insert categories into categories_nested_temp with new IDs and updated paths
-- 5. Update parent_id references using the mapping

-- Step 7: Migrate subcategories (if they exist)
-- Similar process for subcategories table

-- Step 8: Update product_groups with new category_id references
-- Update using the mapping table

-- Step 9: Update products with new category_id and subcategory_id references
-- Update using the mapping table

-- Step 10: Drop old tables and rename temp tables
-- DROP TABLE IF EXISTS `categories_nested`;
-- RENAME TABLE `categories_nested_temp` TO `categories_nested`;
-- DROP TABLE IF EXISTS `products`;
-- RENAME TABLE `products_temp` TO `products`;
-- DROP TABLE IF EXISTS `product_groups`;
-- RENAME TABLE `product_groups_temp` TO `product_groups`;
-- DROP TABLE IF EXISTS `subcategories`;
-- RENAME TABLE `subcategories_temp` TO `subcategories`;

-- Step 11: Clean up
-- DROP TABLE IF EXISTS `category_id_mapping`;

-- Note: The actual migration will be performed by a PHP script that:
-- 1. Creates the temp tables
-- 2. Generates nanoid for each existing category
-- 3. Migrates data with proper ID mapping
-- 4. Updates all foreign key references
-- 5. Swaps the tables
-- 6. Cleans up temp tables
