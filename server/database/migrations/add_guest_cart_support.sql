-- Migration to add guest cart support
-- This allows guest users to have persistent carts in the database

-- Add guest_cart_id column to carts table to support guest carts
ALTER TABLE carts ADD COLUMN guest_cart_id VARCHAR(21) NULL;
ALTER TABLE carts ADD COLUMN is_guest_cart BOOLEAN DEFAULT FALSE;
ALTER TABLE carts ADD COLUMN expires_at TIMESTAMP NULL;

-- Add index for guest cart lookups
CREATE INDEX idx_carts_guest_cart_id ON carts(guest_cart_id);
CREATE INDEX idx_carts_is_guest ON carts(is_guest_cart);
CREATE INDEX idx_carts_expires_at ON carts(expires_at);

-- Remove the NOT NULL constraint from user_id for guest carts
ALTER TABLE carts MODIFY COLUMN user_id INT NULL;

-- Add a check constraint to ensure either user_id or guest_cart_id is set
ALTER TABLE carts ADD CONSTRAINT chk_cart_user_or_guest 
CHECK ((user_id IS NOT NULL AND guest_cart_id IS NULL) OR (user_id IS NULL AND guest_cart_id IS NOT NULL));
