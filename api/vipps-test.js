/**
 * Vipps Authentication Test Endpoint
 * 
 * Tests if Vipps credentials are configured correctly.
 * Returns status and any error messages.
 */

export default async function handler(req, res) {
  // Check environment variables
  const clientId = process.env.VIPPS_CLIENT_ID;
  const clientSecret = process.env.VIPPS_CLIENT_SECRET;
  const merchantSerialNumber = process.env.VIPPS_MERCHANT_SERIAL_NUMBER;
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY;
  const isTestMode = process.env.VIPPS_TEST_MODE !== 'false';

  const missing = [];
  if (!clientId) missing.push('VIPPS_CLIENT_ID');
  if (!clientSecret) missing.push('VIPPS_CLIENT_SECRET');
  if (!merchantSerialNumber) missing.push('VIPPS_MERCHANT_SERIAL_NUMBER');
  if (!subscriptionKey) missing.push('VIPPS_SUBSCRIPTION_KEY');

  if (missing.length > 0) {
    return res.status(500).json({
      success: false,
      error: 'Missing environment variables',
      missing,
      configured: {
        clientId: !!clientId,
        clientSecret: !!clientSecret,
        merchantSerialNumber: !!merchantSerialNumber,
        subscriptionKey: !!subscriptionKey,
        testMode: isTestMode
      }
    });
  }

  const baseUrl = isTestMode
    ? 'https://apitest.vipps.no'
    : 'https://api.vipps.no';

  try {
    // Attempt to get access token
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

    const responseText = await tokenResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!tokenResponse.ok) {
      return res.status(200).json({
        success: false,
        error: 'Authentication failed',
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        response: responseData,
        config: {
          baseUrl,
          testMode: isTestMode,
          merchantSerialNumber: merchantSerialNumber ? `${merchantSerialNumber.substring(0, 3)}***` : 'missing',
          clientId: clientId ? `${clientId.substring(0, 8)}...` : 'missing',
          hasClientSecret: !!clientSecret,
          hasSubscriptionKey: !!subscriptionKey
        }
      });
    }

    // Success!
    return res.status(200).json({
      success: true,
      message: 'Vipps authentication successful',
      testMode: isTestMode,
      tokenReceived: !!responseData.access_token,
      config: {
        baseUrl,
        merchantSerialNumber: merchantSerialNumber ? `${merchantSerialNumber.substring(0, 3)}***` : 'missing'
      }
    });

  } catch (error) {
    return res.status(200).json({
      success: false,
      error: 'Network or server error',
      message: error.message,
      config: {
        baseUrl,
        testMode: isTestMode
      }
    });
  }
}
