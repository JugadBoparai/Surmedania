const { google } = require('googleapis')
const fs = require('fs')

function loadServiceAccount(){
  // Support either passing GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY or a path to a JSON key file
  if(process.env.GOOGLE_CREDENTIALS_FILE){
    const path = process.env.GOOGLE_CREDENTIALS_FILE
    if(!fs.existsSync(path)) throw new Error('Google credentials file not found at ' + path)
    const json = JSON.parse(fs.readFileSync(path, 'utf8'))
    return {
      clientEmail: json.client_email,
      privateKey: json.private_key
    }
  }

  return {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY
  }
}

function getSheetsClient(){
  const creds = loadServiceAccount()
  const clientEmail = creds.clientEmail
  let privateKey = creds.privateKey
  if(!clientEmail || !privateKey) throw new Error('Google credentials not configured. Set GOOGLE_CREDENTIALS_FILE or GOOGLE_CLIENT_EMAIL/GOOGLE_PRIVATE_KEY')

  privateKey = privateKey.replace(/\\n/g, '\n')

  const jwtClient = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  )

  const sheets = google.sheets({ version: 'v4', auth: jwtClient })
  return { sheets, jwtClient }
}

// Append a row to a specific sheet tab (sheetName)
async function appendToSheet(sheetId, sheetName, rowValues){
  const { sheets, jwtClient } = getSheetsClient()
    // rowValues should be an array matching columns; we append to Registrations sheet
  await jwtClient.authorize()
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [rowValues]
    }
  })
}

// Read the first row (headers) of a sheet tab
async function getSheetHeaders(sheetId, sheetName){
  const { sheets, jwtClient } = getSheetsClient()
  await jwtClient.authorize()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:Z1`
  })
  const values = res.data.values || []
  return values[0] || []
}

// Ensure the headers match expected; if missing or different, write expected headers
async function ensureHeadersForSheet(sheetId, sheetName, expectedHeaders){
  const { sheets, jwtClient } = getSheetsClient()
  await jwtClient.authorize()
  let current = []
  try{
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:Z1`
    })
    current = (res.data.values && res.data.values[0]) || []
  }catch(err){
    // If the sheet/tab name is wrong, this will throw; propagate with context
    throw new Error(`Unable to read headers from sheet '${sheetName}': ${err.message}`)
  }

  const needUpdate = current.length === 0 || expectedHeaders.join('|') !== current.join('|')
  if(needUpdate){
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:${String.fromCharCode(64 + expectedHeaders.length)}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [expectedHeaders] }
    })
    return { updated: true, previous: current }
  }
  return { updated: false, previous: current }
}

module.exports = { appendToSheet, getSheetHeaders, ensureHeadersForSheet }
