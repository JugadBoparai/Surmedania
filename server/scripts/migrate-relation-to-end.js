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

async function main(){
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

  const tab = 'Registrations'
  const getRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: `${tab}!A:Z` })
  const values = getRes.data.values || []
  if(values.length === 0){
    console.log('Sheet empty, nothing to migrate.')
    process.exit(0)
  }
  const header = values[0]
  const relationIdx = header.indexOf('Relation')
  if(relationIdx === -1){
    console.log("Header doesn't contain 'Relation', nothing to migrate.")
    process.exit(0)
  }
  const desiredHeader = ['Timestamp','Full Name','Email','Phone','Date of Birth','Member Type','Class Selection','Skill Level','Comments / Notes','Payment Amount','Payment Status','Relation']
  const isAlreadyAtEnd = relationIdx === desiredHeader.length - 1
  if(isAlreadyAtEnd && header.join('|') === desiredHeader.join('|')){
    console.log('Header already in desired order; nothing to migrate.')
    process.exit(0)
  }

  // Build new rows with relation moved to end
  const dataRows = values.slice(1)
  const migratedRows = dataRows.map(row => {
    const r = row.slice()
    const rel = r[relationIdx] || ''
    r.splice(relationIdx, 1) // remove original relation cell
    // Ensure row has at least desiredHeader.length - 1 cells before push
    while(r.length < desiredHeader.length - 1) r.push('')
    r.push(rel)
    return r
  })

  // Update header then rows
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tab}!A1:${String.fromCharCode(64 + desiredHeader.length)}1`,
    valueInputOption: 'RAW',
    requestBody: { values: [desiredHeader] }
  })

  if(migratedRows.length > 0){
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tab}!A2:${String.fromCharCode(64 + desiredHeader.length)}${migratedRows.length+1}`,
      valueInputOption: 'RAW',
      requestBody: { values: migratedRows }
    })
  }

  console.log(`Migrated ${migratedRows.length} rows to move Relation to the end.`)
}

main().catch(err => { console.error('Migration failed:', err.message); process.exit(1) })
