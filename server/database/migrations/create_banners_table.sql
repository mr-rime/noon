-- Create banners table for advertisement management
CREATE TABLE IF NOT EXISTS `banners` (
    `id` CHAR(21) NOT NULL PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `placement` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255),
    `target_url` VARCHAR(2048),
    `image_url` VARCHAR(2048),
    `start_date` TIMESTAMP NOT NULL,
    `end_date` TIMESTAMP NOT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_placement (placement),
    INDEX idx_is_active (is_active),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_placement_active_dates (placement, is_active, start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample banners for testing
INSERT INTO `banners` (`id`, `name`, `placement`, `description`, `target_url`, `image_url`, `start_date`, `end_date`, `is_active`) VALUES
('BNR000000000000000001', 'Summer Sale Hero Banner', 'home_hero', 'Big summer sale with up to 50% off on selected items', '/products?sale=summer', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1),
('BNR000000000000000002', 'New Arrivals Sidebar', 'product_sidebar', 'Check out our latest product arrivals', '/products?filter=new', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=250&fit=crop', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 1),
('BNR000000000000000003', 'Back to School Campaign', 'home_secondary', 'Get ready for school with our special offers', '/categories/school-supplies', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=300&fit=crop', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 25 DAY), 1),
('BNR000000000000000004', 'Flash Sale Popup', 'popup', 'Limited time offer - 24 hours only!', '/flash-sale', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 8 DAY), 0),
('BNR000000000000000005', 'Mobile App Download', 'mobile_home', 'Download our app for exclusive deals', '/app-download', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 90 DAY), 1);
