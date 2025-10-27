-- Migration to add database-based session management
-- This allows sessions to work reliably in production without PHP session storage issues

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(128) NOT NULL PRIMARY KEY,
  `user_id` INT NULL,
  `data` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  INDEX `idx_sessions_user_id` (`user_id`),
  INDEX `idx_sessions_expires_at` (`expires_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Clean up old sessions immediately
DELETE FROM `sessions` WHERE `expires_at` < NOW();

-- Add event to automatically clean up expired sessions (runs daily)
-- Note: Requires EVENT_SCHEDULER to be enabled
-- Check with: SHOW VARIABLES LIKE 'event_scheduler';
-- Enable with: SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS `cleanup_expired_sessions`
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM `sessions` WHERE `expires_at` < NOW();
