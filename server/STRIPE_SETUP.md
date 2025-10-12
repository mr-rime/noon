# Stripe Payment Integration Setup

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=noon_db

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Session Configuration
SESSION_NAME=NOON_SESSION
```

## Stripe Setup Steps

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Complete the account setup process

2. **Get API Keys**
   - Go to the Stripe Dashboard
   - Navigate to Developers > API Keys
   - Copy your Test Publishable Key and Test Secret Key
   - Add them to your `.env` file

3. **Set up Webhooks**
   - In the Stripe Dashboard, go to Developers > Webhooks
   - Click "Add endpoint"
   - Set the endpoint URL to: `http://localhost:8000/webhooks/stripe-webhook` (for local development)
   - For production: `https://yourdomain.com/webhooks/stripe-webhook`
   - Select the following events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the webhook signing secret and add it to your `.env` file

4. **Install Stripe PHP SDK**
   ```bash
   cd server
   composer require stripe/stripe-php
   ```

## Database Tables

The following tables are already created in your database:

- `orders` - Stores order information
- `order_items` - Stores individual items in each order
- `tracking_details` - Stores tracking information for orders

## Testing

1. Use Stripe's test card numbers for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. Test the complete flow:
   - Add items to cart
   - Click checkout
   - Complete payment on Stripe
   - Verify order is created in database
   - Check tracking details are generated

## Production Setup

1. Switch to live Stripe keys
2. Update webhook URL to production domain
3. Test with real payment methods
4. Monitor webhook logs for any issues
