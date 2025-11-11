require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const fs = require('fs')
const path = require('path')
const { appendToSheet } = require('../googleSheets')

const CSV_PATH = path.join(__dirname, '../registrations.csv')

async function migrateCSVToSheets() {
  const sheetId = process.env.SHEET_ID
  if (!sheetId) {
    console.error('Missing SHEET_ID in environment. Please set it in server/.env')
    process.exit(1)
  }
  if (!fs.existsSync(CSV_PATH)) {
    console.error('registrations.csv not found')
    process.exit(1)
  }
  const lines = fs.readFileSync(CSV_PATH, 'utf8').split('\n')
  if (lines.length < 2) {
    console.log('No data rows to migrate')
    process.exit(0)
  }
  const header = lines[0].split(',')
  for (let i = 1; i < lines.length; ++i) {
    const row = lines[i]
    if (!row.trim()) continue
    const cols = row.split(',')
    // Skip if row length doesn't match header
    if (cols.length !== header.length) continue
    try {
      await appendToSheet(sheetId, 'Registrations', cols)
      console.log(`Migrated row ${i} to Google Sheets.`)
    } catch (err) {
      console.error(`Failed to migrate row ${i}:`, err.message)
    }
  }
  console.log('Migration complete.')
}

migrateCSVToSheets()
