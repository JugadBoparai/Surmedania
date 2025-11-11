/**
 * Vipps eCom API - Initiate Payment
 * 
 * Creates a payment session and returns a redirect URL for the user.
 * 
 * Required environment variables:
 * - VIPPS_CLIENT_ID
 * - VIPPS_CLIENT_SECRET
 * - VIPPS_MERCHANT_SERIAL_NUMBER
 * - VIPPS_SUBSCRIPTION_KEY (Ocp-Apim-Subscription-Key)
 * - VIPPS_MSN (same as merchant serial number, for consistency)
 * - VIPPS_TEST_MODE (optional, defaults to true for test environment)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    amount,
    memberType,
    name,
    phone,
    email,
    orderId
  } = req.body;

  // Validation
  if (!amount || !memberType || !name || !orderId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const amountNum = parseInt(amount);
  if (isNaN(amountNum) || amountNum < 50) {
    return res.status(400).json({ error: 'Invalid amount (minimum 50 NOK)' });
  }

  // Environment variables
  const clientId = process.env.VIPPS_CLIENT_ID;
  const clientSecret = process.env.VIPPS_CLIENT_SECRET;
  const merchantSerialNumber = process.env.VIPPS_MERCHANT_SERIAL_NUMBER;
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY;
  const isTestMode = process.env.VIPPS_TEST_MODE !== 'false'; // Default to test

  if (!clientId || !clientSecret || !merchantSerialNumber || !subscriptionKey) {
    console.error('Missing Vipps credentials in environment variables');
    return res.status(500).json({ error: 'Payment service not configured' });
  }

  const baseUrl = isTestMode
    ? 'https://apitest.vipps.no'
    : 'https://api.vipps.no';

  try {
    // Step 1: Get access token
    const tokenResponse = await fetch(`${baseUrl}/accesstoken/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client_id': clientId,
        'client_secret': clientSecret,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Merchant-Serial-Number': merchantSerialNumber
      }
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Vipps token error:', errorText);
      return res.status(500).json({ error: 'Failed to authenticate with Vipps' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Initiate payment
    const callbackUrl = `${process.env.VERCEL_URL || 'https://www.surmedania.com'}/api/vipps-callback`;
    const fallbackUrl = `${process.env.VERCEL_URL || 'https://www.surmedania.com'}/registration/payment-complete`;

    const paymentPayload = {
      merchantInfo: {
        merchantSerialNumber: merchantSerialNumber,
        callbackPrefix: callbackUrl,
        fallBack: fallbackUrl
      },
      transaction: {
        orderId: orderId,
        amount: amountNum * 100, // Amount in øre (smallest unit)
        transactionText: `Surmedania ${memberType === 'active' ? 'Active' : 'Supported'} Membership`,
        timeStamp: new Date().toISOString()
      },
      customerInfo: {
        mobileNumber: phone ? phone.replace(/\s+/g, '').replace(/^\+47/, '') : undefined
      }
    };

    const paymentResponse = await fetch(`${baseUrl}/ecomm/v2/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Merchant-Serial-Number': merchantSerialNumber,
        'X-Request-Id': orderId
      },
      body: JSON.stringify(paymentPayload)
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json().catch(() => ({}));
      console.error('Vipps payment initiation error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to create payment', 
        details: errorData 
      });
    }

    const paymentData = await paymentResponse.json();
    
    // Return the Vipps URL for redirect
    return res.status(200).json({
      success: true,
      url: paymentData.url,
      orderId: orderId
    });

  } catch (error) {
    console.error('Vipps API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
