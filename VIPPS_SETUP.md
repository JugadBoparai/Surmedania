# Vipps eCom API Integration Guide

## Overview
This integration allows Surmedania to accept payments directly through the Vipps API, providing a seamless payment experience.

## Prerequisites
1. Vipps merchant account (https://vipps.no/)
2. Access to Vipps Portal (portal.vipps.no)
3. API credentials from Vipps

## Setup Steps

### 1. Get Vipps Credentials
Login to https://portal.vipps.no/ and navigate to your test/production keys:
- **Client ID**
- **Client Secret**
- **Merchant Serial Number (MSN)**
- **Subscription Key** (Ocp-Apim-Subscription-Key)

### 2. Add Environment Variables to Vercel
Go to your Vercel project settings → Environment Variables and add:

```
VIPPS_CLIENT_ID=your_client_id_here
VIPPS_CLIENT_SECRET=your_client_secret_here
VIPPS_MERCHANT_SERIAL_NUMBER=your_msn_here
VIPPS_SUBSCRIPTION_KEY=your_subscription_key_here
VIPPS_TEST_MODE=true
```

**For production**, set `VIPPS_TEST_MODE=false`

### 3. Configure Vipps Callback URLs
In Vipps Portal, add these URLs:
- **Callback URL**: `https://www.surmedania.com/api/vipps-callback`
- **Fallback URL**: `https://www.surmedania.com/registration/payment-complete`

### 4. Update App Routing
Add the payment complete route to `src/App.jsx`:

```jsx
import PaymentComplete from './pages/PaymentComplete'

// Inside <Routes>:
<Route path="/registration/payment-complete" element={<PaymentComplete />} />
```

### 5. Replace RegistrationConfirm Component
Replace the contents of `src/pages/RegistrationConfirm.jsx` with `src/pages/RegistrationConfirm-updated.jsx`

## How It Works

### Payment Flow
1. User selects payment amount on confirmation page
2. Frontend calls `/api/vipps-initiate` with payment details
3. Backend creates Vipps payment session and returns redirect URL
4. User is redirected to Vipps app/website
5. After payment, Vipps redirects back to `/registration/payment-complete`
6. Vipps also sends webhook to `/api/vipps-callback` with payment status

### API Endpoints

#### `/api/vipps-initiate` (POST)
Initiates a payment session.

**Request:**
```json
{
  "amount": "449",
  "memberType": "active",
  "name": "John Doe",
  "phone": "12345678",
  "email": "john@example.com",
  "orderId": "SUR1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://api.vipps.no/dwo-api-application/v1/deeplink/vippsgateway?...",
  "orderId": "SUR1234567890"
}
```

#### `/api/vipps-callback` (POST)
Receives payment status updates from Vipps.

### Order ID Format
Order IDs are generated as: `SUR{timestamp}{random}`
Example: `SUR1731337200ABC12`

## Testing

### Test Mode
With `VIPPS_TEST_MODE=true`, the integration uses Vipps test environment:
- Base URL: `https://apitest.vipps.no`
- Use Vipps test app or test cards

### Test Users
Vipps provides test users in their portal. Use these for testing payments.

### Manual Fallback
If API payment fails, users can still see manual payment instructions with Vipps number `943635`.

## Security Notes

1. **Never commit credentials** - Always use environment variables
2. **HTTPS only** - Vipps requires HTTPS for all endpoints
3. **Validate webhooks** - The callback endpoint should verify requests are from Vipps (add signature validation if needed)
4. **Order ID uniqueness** - Ensure each order ID is unique to prevent duplicate payments

## Troubleshooting

### Common Errors

**401 Unauthorized**
- Check your `VIPPS_CLIENT_ID` and `VIPPS_CLIENT_SECRET`
- Verify `VIPPS_SUBSCRIPTION_KEY` is correct

**403 Forbidden**
- Merchant Serial Number might be incorrect
- Check if MSN matches your Vipps account

**Payment not appearing in Vipps Portal**
- Ensure you're checking the right environment (test vs production)
- Verify `VIPPS_TEST_MODE` setting

**Callback not received**
- Check callback URL configuration in Vipps Portal
- Verify your serverless function is deployed
- Check Vercel function logs

## Production Checklist

Before going live:
- [ ] Switch to production Vipps credentials
- [ ] Set `VIPPS_TEST_MODE=false`
- [ ] Test with real payment (small amount)
- [ ] Verify callback URL is accessible
- [ ] Monitor Vercel function logs
- [ ] Set up payment confirmation emails (optional)
- [ ] Add payment status to Google Sheets (optional)

## Resources

- [Vipps eCom API Documentation](https://vippsas.github.io/vipps-developer-docs/docs/APIs/ecom-api/)
- [Vipps Portal](https://portal.vipps.no/)
- [Vipps Test Environment](https://github.com/vippsas/vipps-developers/blob/master/vipps-test-environment.md)

## Support

For Vipps-specific issues, contact Vipps support through their portal.
For integration issues, check Vercel function logs and the browser console.
