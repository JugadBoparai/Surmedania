require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { google } = require('googleapis')
const fs = require('fs')

function loadServiceAccount(){
  if(process.env.GOOGLE_CREDENTIALS_FILE){
    const p = process.env.GOOGLE_CREDENTIALS_FILE
    if(!fs.existsSync(p)) throw new Error('Google credentials file not found at ' + p)
    const json = JSON.parse(fs.readFileSync(p, 'utf8'))
    return { clientEmail: json.client_email, privateKey: json.private_key }
  }
  return { clientEmail: process.env.GOOGLE_CLIENT_EMAIL, privateKey: process.env.GOOGLE_PRIVATE_KEY }
}

function formatTimestampNO(date) {
  const pad = n => String(n).padStart(2, '0')
  const dd = pad(date.getDate())
  const mm = pad(date.getMonth() + 1)
  const yyyy = date.getFullYear()
  const HH = pad(date.getHours())
  const MM = pad(date.getMinutes())
  const SS = pad(date.getSeconds())
  return `${dd}.${mm}.${yyyy} kl. ${HH}.${MM}.${SS}`
}

function tryParseTimestamp(ts) {
  if (/^\d{2}\.\d{2}\.\d{4} kl\. \d{2}\.\d{2}\.\d{2}$/.test(ts)) return ts
  let d = null
  if (/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/.test(ts)) {
    const [date, time] = ts.split(', ')
    const [dd, mm, yyyy] = date.split('/')
    const [HH, MM, SS] = time.split(':')
    d = new Date(`${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}`)
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(ts)) {
    d = new Date(ts)
  }
  if (d && !isNaN(d.getTime())) return formatTimestampNO(d)
  return ts
}

async function migrateFeedbackSheet(){
  const sheetId = process.env.SHEET_ID
  if(!sheetId){
    console.error('Missing SHEET_ID'); process.exit(1)
  }
  const creds = loadServiceAccount()
  let { clientEmail, privateKey } = creds
  if(!clientEmail || !privateKey){
    console.error('Missing Google credentials'); process.exit(1)
  }
  privateKey = privateKey.replace(/\\n/g, '\n')
  const jwtClient = new google.auth.JWT(clientEmail, null, privateKey, ['https://www.googleapis.com/auth/spreadsheets'])
  const sheets = google.sheets({ version: 'v4', auth: jwtClient })
  await jwtClient.authorize()

  const tab = 'Feedback'
  const getRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: `${tab}!A:Z` })
  const values = getRes.data.values || []
  if(values.length === 0){
    console.log('Sheet empty, nothing to migrate.')
    process.exit(0)
  }
  const header = values[0]
  const dataRows = values.slice(1)
  const migratedRows = dataRows.map(row => {
    const r = row.slice()
    r[0] = tryParseTimestamp(r[0])
    return r
  })

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tab}!A2:${String.fromCharCode(65 + header.length - 1)}${migratedRows.length+1}`,
    valueInputOption: 'RAW',
    requestBody: { values: migratedRows }
  })

  console.log(`Migrated ${migratedRows.length} rows in Feedback sheet to Norwegian timestamp format.`)
}

migrateFeedbackSheet().catch(err => { console.error('Migration failed:', err.message); process.exit(1) })
