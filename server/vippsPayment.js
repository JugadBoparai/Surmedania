const axios = require('axios')

// Vipps API Configuration
const VIPPS_BASE_URL = process.env.VIPPS_ENV === 'production' 
  ? 'https://api.vipps.no' 
  : 'https://apitest.vipps.no'

const VIPPS_CLIENT_ID = process.env.VIPPS_CLIENT_ID
const VIPPS_CLIENT_SECRET = process.env.VIPPS_CLIENT_SECRET
const VIPPS_SUBSCRIPTION_KEY = process.env.VIPPS_SUBSCRIPTION_KEY
const VIPPS_MSN = process.env.VIPPS_MSN
const CALLBACK_URL = process.env.VIPPS_CALLBACK_URL || 'http://localhost:4000/vipps/callback'
const FRONTEND_URL = process.env.VIPPS_FRONTEND_URL || 'http://localhost:5173'

let accessToken = null
let tokenExpiry = null

/**
 * Get Vipps Access Token
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }

  try {
    const response = await axios.post(
      `${VIPPS_BASE_URL}/accesstoken/get`,
      {},
      {
        headers: {
          'client_id': VIPPS_CLIENT_ID,
          'client_secret': VIPPS_CLIENT_SECRET,
          'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY
        }
      }
    )

    accessToken = response.data.access_token
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000 // Refresh 1 min before expiry
    
    return accessToken
  } catch (error) {
    console.error('Failed to get Vipps access token:', error.response?.data || error.message)
    throw new Error('Failed to authenticate with Vipps')
  }
}

/**
 * Create Vipps Payment
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in NOK (will be converted to øre)
 * @param {string} paymentData.description - Payment description
 * @param {string} paymentData.reference - Unique reference for this payment
 * @param {string} paymentData.userPhone - User's phone number (optional)
 */
async function createPayment({ amount, description, reference, userPhone }) {
  const token = await getAccessToken()
  
  const paymentPayload = {
    amount: {
      currency: 'NOK',
      value: amount * 100 // Convert NOK to øre
    },
    paymentMethod: {
      type: 'WALLET'
    },
    customer: userPhone ? {
      phoneNumber: userPhone.replace(/\s/g, '') // Remove spaces from phone
    } : undefined,
    reference: reference,
    userFlow: 'WEB_REDIRECT',
    returnUrl: `${FRONTEND_URL}/registration/confirm?reference=${reference}`,
    paymentDescription: description
  }

  try {
    const response = await axios.post(
      `${VIPPS_BASE_URL}/epayment/v1/payments`,
      paymentPayload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY,
          'Merchant-Serial-Number': VIPPS_MSN,
          'Content-Type': 'application/json',
          'Idempotency-Key': reference // Prevent duplicate payments
        }
      }
    )

    return {
      reference: response.data.reference,
      redirectUrl: response.data.redirectUrl
    }
  } catch (error) {
    console.error('Failed to create Vipps payment:', error.response?.data || error.message)
    throw new Error('Failed to create Vipps payment')
  }
}

/**
 * Get Payment Status
 * @param {string} reference - Payment reference
 */
async function getPaymentStatus(reference) {
  const token = await getAccessToken()

  try {
    const response = await axios.get(
      `${VIPPS_BASE_URL}/epayment/v1/payments/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY,
          'Merchant-Serial-Number': VIPPS_MSN
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Failed to get payment status:', error.response?.data || error.message)
    throw new Error('Failed to get payment status')
  }
}

module.exports = {
  createPayment,
  getPaymentStatus
}
