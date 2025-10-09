-- New PSKU System Database Schema
-- This replaces the old product_options and product_variants system

-- Categories table (updated with hierarchical structure)
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) UNIQUE NOT NULL,
    `description` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_categories_slug` (`slug`),
    INDEX `idx_categories_active` (`is_active`)
);

-- Subcategories table
DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE `subcategories` (
    `subcategory_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) UNIQUE NOT NULL,
    `description` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_subcategories_category`
        FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`)
        ON DELETE CASCADE,
    INDEX `idx_subcategories_category` (`category_id`),
    INDEX `idx_subcategories_slug` (`slug`),
    INDEX `idx_subcategories_active` (`is_active`)
);

-- Brands table (for brand selection in step 2)
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
    `brand_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) UNIQUE NOT NULL,
    `description` TEXT,
    `logo_url` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_brands_slug` (`slug`),
    INDEX `idx_brands_active` (`is_active`)
);

-- Product Groups table (replaces old variant system)
DROP TABLE IF EXISTS `product_groups`;
CREATE TABLE `product_groups` (
    `group_id` VARCHAR(21) PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `category_id` INT,
    `subcategory_id` INT,
    `brand_id` INT,
    `attributes` JSON, -- Dynamic attributes based on category (e.g., ["Color", "Size", "Model"])
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_product_groups_category`
        FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_product_groups_subcategory`
        FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`subcategory_id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_product_groups_brand`
        FOREIGN KEY (`brand_id`) REFERENCES `brands`(`brand_id`)
        ON DELETE SET NULL,
    INDEX `idx_product_groups_category` (`category_id`),
    INDEX `idx_product_groups_subcategory` (`subcategory_id`),
    INDEX `idx_product_groups_brand` (`brand_id`)
);

-- Update products table to support PSKU system
ALTER TABLE `products` 
ADD COLUMN `psku` VARCHAR(100) UNIQUE AFTER `id`,
ADD COLUMN `group_id` VARCHAR(21) AFTER `psku`,
ADD COLUMN `brand_id` INT AFTER `group_id`,
ADD COLUMN `subcategory_id` INT AFTER `category_id`,
ADD COLUMN `stock` INT DEFAULT 0 AFTER `price`,
ADD COLUMN `is_returnable` TINYINT(1) DEFAULT 0 AFTER `stock`,
ADD COLUMN `is_public` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_returnable`,
ADD COLUMN `final_price` FLOAT AFTER `is_public`,
ADD COLUMN `store_id` INT UNSIGNED AFTER `user_id`,
MODIFY COLUMN `name` VARCHAR(500),
MODIFY COLUMN `user_id` INT NULL; -- Allow NULL for store products

-- Add foreign key constraints for products
ALTER TABLE `products`
ADD CONSTRAINT `fk_products_group`
    FOREIGN KEY (`group_id`) REFERENCES `product_groups`(`group_id`)
    ON DELETE SET NULL,
ADD CONSTRAINT `fk_products_brand`
    FOREIGN KEY (`brand_id`) REFERENCES `brands`(`brand_id`)
    ON DELETE SET NULL,
ADD CONSTRAINT `fk_products_subcategory`
    FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`subcategory_id`)
    ON DELETE SET NULL;

-- Add indexes for products
ALTER TABLE `products`
ADD INDEX `idx_products_psku` (`psku`),
ADD INDEX `idx_products_group` (`group_id`),
ADD INDEX `idx_products_brand` (`brand_id`),
ADD INDEX `idx_products_subcategory` (`subcategory_id`),
ADD INDEX `idx_products_store` (`store_id`),
ADD INDEX `idx_products_is_public` (`is_public`);

-- Product Group Attributes table (for dynamic attribute management)
DROP TABLE IF EXISTS `product_group_attributes`;
CREATE TABLE `product_group_attributes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `group_id` VARCHAR(21) NOT NULL,
    `attribute_name` VARCHAR(100) NOT NULL,
    `attribute_values` JSON, -- Array of possible values for this attribute
    `is_required` BOOLEAN DEFAULT TRUE,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_group_attributes_group`
        FOREIGN KEY (`group_id`) REFERENCES `product_groups`(`group_id`)
        ON DELETE CASCADE,
    INDEX `idx_group_attributes_group` (`group_id`),
    INDEX `idx_group_attributes_order` (`display_order`)
);

-- Product Attribute Values table (stores actual attribute values for each product)
DROP TABLE IF EXISTS `product_attribute_values`;
CREATE TABLE `product_attribute_values` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` VARCHAR(21) NOT NULL,
    `attribute_name` VARCHAR(100) NOT NULL,
    `attribute_value` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_product_attributes_product`
        FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
        ON DELETE CASCADE,
    INDEX `idx_product_attributes_product` (`product_id`),
    INDEX `idx_product_attributes_name` (`attribute_name`),
    UNIQUE KEY `uniq_product_attribute` (`product_id`, `attribute_name`)
);

-- Drop old tables that are being replaced
-- Note: Uncomment these when ready to migrate
-- DROP TABLE IF EXISTS `product_options`;
-- DROP TABLE IF EXISTS `product_variants`;

-- Insert some sample data for testing
INSERT INTO `categories` (`name`, `slug`, `description`) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories'),
('Mobiles', 'mobiles', 'Mobile phones and accessories'),
('Vehicles', 'vehicles', 'Cars, motorcycles, and vehicle accessories'),
('Fashion', 'fashion', 'Clothing, shoes, and accessories'),
('Home & Garden', 'home-garden', 'Home improvement and garden supplies');

INSERT INTO `subcategories` (`category_id`, `name`, `slug`, `description`) VALUES
(1, 'Smartphones', 'smartphones', 'Mobile smartphones'),
(1, 'Laptops', 'laptops', 'Laptop computers'),
(1, 'Headphones', 'headphones', 'Audio headphones and earbuds'),
(2, 'Mobile Phones', 'mobile-phones', 'All types of mobile phones'),
(2, 'Mobile Accessories', 'mobile-accessories', 'Cases, chargers, and other accessories'),
(3, 'Cars', 'cars', 'Passenger cars'),
(3, 'Motorcycles', 'motorcycles', 'Motorcycles and scooters');

INSERT INTO `brands` (`name`, `slug`, `description`) VALUES
('Apple', 'apple', 'Apple Inc. products'),
('Samsung', 'samsung', 'Samsung Electronics'),
('Sony', 'sony', 'Sony Corporation'),
('Nike', 'nike', 'Nike sportswear'),
('Generic', 'generic', 'Products without specific brand');
