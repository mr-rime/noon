# Database Table Initialization

This backend automatically creates all necessary database tables if they don't exist.

## How It Works

1. **Automatic Initialization**: When the GraphQL endpoint is first accessed, the system checks if tables exist
2. **One-Time Setup**: A flag file (`.db_initialized`) is created after successful initialization to prevent repeated checks
3. **Manual Initialization**: You can also manually run the initialization script

## Manual Table Creation

To manually create all tables, run:

```bash
php scripts/init-tables.php
```

This will:
- Check database connection
- Create all 26 tables if they don't exist
- Show progress for each table
- Display a summary of successful and failed operations

## Tables Created

The initialization script creates the following tables:

### User Management
- `users` - User accounts
- `stores` - User stores

### Product Catalog
- `brands` - Product brands
- `categories_nested` - Hierarchical categories (nested set model)
- `subcategories` - Product subcategories
- `products` - Main product table
- `product_images` - Product images
- `product_specifications` - Product specifications
- `product_groups` - Product grouping
- `product_group_attributes` - Group-level attributes
- `product_attribute_values` - Product-level attribute values

### Pricing & Promotions
- `discounts` - Product discounts
- `coupons` - Discount coupons

### Shopping
- `carts` - Shopping carts (user and guest)
- `cart_items` - Cart items
- `wishlists` - User wishlists
- `wishlist_items` - Wishlist items

### Orders
- `orders` - Customer orders
- `order_items` - Order line items
- `order_tracking` - Order tracking information
- `tracking_details` - Detailed tracking information

### Reviews & Engagement
- `reviews` - Product reviews
- `review_helpful_votes` - Helpful review votes
- `browsing_history` - User browsing history

### Content
- `banners` - Homepage banners
- `partners` - Partner/sponsor information

## Resetting the Database

To force re-initialization of tables:

1. Delete the flag file:
   ```bash
   rm .db_initialized
   ```

2. Either:
   - Access any GraphQL endpoint (tables will be initialized automatically), OR
   - Run the manual initialization script: `php scripts/init-tables.php`

## Database Configuration

Database connection settings are configured in `config/db.php` and use the following environment variables:

- `DB_HOST` (default: 127.0.0.1)
- `DB_USER` (default: root)
- `DB_PASSWORD` (default: 51857)
- `DB_NAME` (default: noon_db)
- `DB_PORT` (default: 3307)

Make sure your `.env` file has the correct database credentials before running the initialization.
