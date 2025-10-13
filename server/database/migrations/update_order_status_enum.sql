-- Update order status enum to use new values
-- Change 'pending' to 'placed' and 'shipped' to 'confirmed'

-- First, update existing records
UPDATE orders SET status = 'placed' WHERE status = 'pending';
UPDATE orders SET status = 'confirmed' WHERE status = 'shipped';

-- Then update the enum definition
ALTER TABLE orders MODIFY COLUMN status ENUM('placed','processing','confirmed','dispatched','delivered','cancelled') DEFAULT 'placed';

-- Update any existing tracking records if they exist
UPDATE order_tracking SET status = 'placed' WHERE status = 'pending';
UPDATE order_tracking SET status = 'confirmed' WHERE status = 'shipped';

-- Update tracking table enum if it exists
ALTER TABLE order_tracking MODIFY COLUMN status ENUM('placed','processing','confirmed','dispatched','delivered','cancelled') DEFAULT 'placed';
