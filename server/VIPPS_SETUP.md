# Vipps ePayment API Setup Guide

## Prerequisites
- Vipps Business Account
- Access to Vipps Portal: https://portal.vipps.no

## Step 1: Get Your Vipps Credentials

1. Log in to https://portal.vipps.no
2. Select your sales unit/merchant
3. Navigate to **Utvikler** (Developer) section
4. You will find:
   - **Client ID** (sometimes called Application ID)
   - **Client Secret**
   - **Subscription Key** (Ocp-Apim-Subscription-Key)
   - **Merchant Serial Number (MSN)**

## Step 2: Configure Test Environment

1. In the Vipps Portal, make sure you're in **TEST** mode first
2. Get your TEST credentials (separate from production)
3. Download the Vipps Test app on your phone for testing

## Step 3: Update Server Configuration

Edit `server/.env` file and add your Vipps credentials:

```env
# Vipps Configuration
VIPPS_ENV=test
VIPPS_CLIENT_ID=your-test-client-id-here
VIPPS_CLIENT_SECRET=your-test-client-secret-here
VIPPS_SUBSCRIPTION_KEY=your-test-subscription-key-here
VIPPS_MSN=your-merchant-serial-number-here
VIPPS_CALLBACK_URL=http://localhost:4000/vipps/callback
VIPPS_FRONTEND_URL=http://localhost:5173
```

## Step 4: Testing

1. Restart your webhook server: `cd server && node index.js`
2. Register on the website
3. Click a Vipps payment button (6 or 12 months)
4. You'll be redirected to Vipps
5. Complete payment in the Vipps Test app
6. You'll be redirected back to the confirmation page

## Step 5: Production Deployment

When ready for production:

1. Get your **PRODUCTION** credentials from Vipps Portal
2. Update `.env`:
   ```env
   VIPPS_ENV=production
   VIPPS_CLIENT_ID=your-prod-client-id
   VIPPS_CLIENT_SECRET=your-prod-client-secret
   VIPPS_SUBSCRIPTION_KEY=your-prod-subscription-key
   VIPPS_MSN=your-prod-msn
   VIPPS_CALLBACK_URL=https://yourdomain.com/vipps/callback
   VIPPS_FRONTEND_URL=https://yourdomain.com
   ```

3. Deploy your server to a hosting service
4. Update the frontend `.env` to point to your production server

## How It Works

1. User clicks payment button → Frontend calls `/vipps/create-payment`
2. Backend creates Vipps payment session → Returns redirect URL
3. User is redirected to Vipps → Completes payment
4. Vipps redirects back to your site with payment reference
5. You can check payment status via `/vipps/payment-status/:reference`

## Troubleshooting

### "Failed to authenticate with Vipps"
- Check your credentials are correct
- Verify you're using TEST credentials in test mode
- Check if your subscription key is active

### "Failed to create Vipps payment"
- Ensure MSN is correct
- Check amount is valid (must be positive integer)
- Verify returnUrl is accessible

### Payment not working on mobile
- Ensure Vipps app is installed
- For testing, use Vipps Test app (not regular Vipps app)

## Support

Vipps Developer Documentation: https://developer.vippsmobilepay.com/docs/APIs/epayment-api/
Vipps Support: support@vipps.no
