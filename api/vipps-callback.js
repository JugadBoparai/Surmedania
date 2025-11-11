/**
 * Vipps eCom API - Payment Callback
 * 
 * Handles payment status updates from Vipps.
 * This endpoint is called by Vipps when payment status changes.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    orderId,
    transactionInfo
  } = req.body;

  console.log('Vipps callback received:', JSON.stringify(req.body, null, 2));

  // You can store payment status in database or Google Sheets here
  // For now, just log it

  const status = transactionInfo?.status;
  const amount = transactionInfo?.amount;

  if (status === 'RESERVED' || status === 'SALE') {
    console.log(`Payment successful for order ${orderId}: ${amount} øre`);
    
    // TODO: Update Google Sheets with payment status
    // TODO: Send confirmation email
    
    return res.status(200).json({ success: true });
  }

  console.log(`Payment status for order ${orderId}: ${status}`);
  return res.status(200).json({ success: true });
}
