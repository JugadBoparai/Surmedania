require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { appendToSheet } = require('../googleSheets')

async function main(){
  const sheetId = process.env.SHEET_ID
  if(!sheetId){
    console.error('Missing SHEET_ID in environment.')
    process.exit(1)
  }
  const now = new Date()
  const pad = n => String(n).padStart(2,'0')
  const readableTimestamp = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()} kl. ${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`
  const rowData = [
    readableTimestamp,
    'Supported Test',           // Full Name
    'supported@example.com',    // Email
    '55500011',                 // Phone
    '',                         // Date of Birth (not required for supported)
    'supported',                // Member Type
    '',                         // Class Selection (not applicable)
    '',                         // Skill Level
    'Supported member test',    // Comments / Notes
    '',                         // Payment Amount
    'Pending',                  // Payment Status
    'Parent of student'         // Relation at end
  ]
  try{
    await appendToSheet(sheetId, 'Registrations', rowData)
    console.log('Success: appended supported member test row.')
  }catch(err){
    console.error('Failed to append supported member row:', err.message)
    process.exit(1)
  }
}

main()
