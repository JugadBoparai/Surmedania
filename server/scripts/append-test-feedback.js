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

  // Feedback sheet columns: Timestamp, Anonymous, Name, Email, Feedback
  const rowData = [
    readableTimestamp,
    'No',
    'Test Feedback User',
    'feedback@example.com',
    'This is a test feedback row appended via script.'
  ]

  try{
    await appendToSheet(sheetId, 'Feedback', rowData)
    console.log('Success: appended test feedback row to Google Sheet (Feedback tab).')
  }catch(err){
    console.error('Failed to append feedback test row:', err.message)
    process.exit(1)
  }
}

main()
