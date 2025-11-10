require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { appendToSheet } = require('../googleSheets')

async function main(){
  const sheetId = process.env.SHEET_ID
  if(!sheetId){
    console.error('Missing SHEET_ID in environment. Please set it in server/.env')
    process.exit(1)
  }

  const now = new Date()
  const pad = n => String(n).padStart(2,'0')
  const readableTimestamp = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()} kl. ${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`

  const rowData = [
    readableTimestamp,               // Timestamp
    'Test User',                     // Full Name
    'test@example.com',              // Email
    '12345678',                      // Phone
    '2000-01-01',                    // Date of Birth
    'active',                        // Member Type
    'Thursday',                      // Class Selection
    'Beginner',                      // Skill Level
    'Sheet write test via script',   // Comments / Notes
    '349',                           // Payment Amount
    'Pending',                       // Payment Status
    ''                               // Relation (blank for active members) at end
  ]

  try{
    await appendToSheet(sheetId, 'Registrations', rowData)
    console.log('Success: appended test row to Google Sheet (Registrations tab).')
  }catch(err){
    console.error('Failed to append test row:', err.message)
    process.exit(1)
  }
}

main()
