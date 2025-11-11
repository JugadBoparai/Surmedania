const { appendToSheet } = require('../server/googleSheets')

function formatTimestampNO(date = new Date()){
  const pad = n => String(n).padStart(2, '0')
  const dd = pad(date.getDate())
  const mm = pad(date.getMonth() + 1)
  const yyyy = date.getFullYear()
  const HH = pad(date.getHours())
  const MM = pad(date.getMinutes())
  const SS = pad(date.getSeconds())
  return `${dd}.${mm}.${yyyy} kl. ${HH}.${MM}.${SS}`
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const data = req.body
  
  if (!data || !data.name || !data.email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const hasDirectCreds = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    const hasCredsFile = process.env.GOOGLE_CREDENTIALS_FILE
    
    if (process.env.SHEET_ID && (hasDirectCreds || hasCredsFile)) {
      const now = new Date()
      const readableTimestamp = formatTimestampNO(now)
      
      let rowData
      if (data.memberType === 'supported') {
        rowData = [
          readableTimestamp,
          data.name || '',
          data.email || '',
          data.phone || '',
          data.dob || '',
          data.memberType || '',
          data.classSelection || '',
          data.experience || data.skillLevel || '',
          data.relation || '',
          '',
          data.paymentAmount || '',
          data.paymentStatus || ''
        ]
      } else {
        rowData = [
          readableTimestamp,
          data.name || '',
          data.email || '',
          data.phone || '',
          data.dob || '',
          data.memberType || '',
          data.classSelection || '',
          data.experience || data.skillLevel || '',
          data.comments || '',
          data.paymentAmount || '',
          data.paymentStatus || '',
          data.relation || ''
        ]
      }
      
      await appendToSheet(process.env.SHEET_ID, 'Registrations', rowData)
      console.log('[WEBHOOK] Sheets append success:', data.email)
      return res.json({ ok: true, note: 'saved-to-sheets' })
    }
  } catch (err) {
    console.error('Google Sheets append failed', err)
  }

  // Fallback to CSV (won't work well on Vercel due to read-only filesystem)
  return res.status(500).json({ error: 'Google Sheets required for production' })
}
