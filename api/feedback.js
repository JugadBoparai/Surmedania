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
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { anonymous, name, email, feedback } = req.body
  
  if (!feedback || feedback.trim() === '') {
    return res.status(400).json({ error: 'Feedback is required' })
  }

  const readableTimestamp = formatTimestampNO(new Date())

  try {
    const hasDirectCreds = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    const hasCredsFile = process.env.GOOGLE_CREDENTIALS_FILE
    
    if (process.env.SHEET_ID && (hasDirectCreds || hasCredsFile)) {
      await appendToSheet(process.env.SHEET_ID, 'Feedback', [
        readableTimestamp,
        anonymous ? 'Yes' : 'No',
        anonymous ? '' : (name || ''),
        anonymous ? '' : (email || ''),
        feedback.trim()
      ])
      console.log('[FEEDBACK] Sheets append success:', anonymous ? 'anonymous' : email)
      return res.json({ ok: true, note: 'saved-to-sheets' })
    }
  } catch (e) {
    console.error('Google Sheets append (feedback) failed', e)
  }

  return res.status(500).json({ error: 'Google Sheets required for production' })
}
