require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { ensureHeadersForSheet } = require('../googleSheets')

async function run(){
  const sheetId = process.env.SHEET_ID
  if(!sheetId){
    console.error('Missing SHEET_ID')
    process.exit(1)
  }
  const registrationsHeaders = [
    'Timestamp','Full Name','Email','Phone','Date of Birth','Member Type','Class Selection','Skill Level','Comments / Notes','Payment Amount','Payment Status','Relation'
  ]
  const feedbackHeaders = [
    'Timestamp','Anonymous','Name','Email','Feedback'
  ]
  try{
    const reg = await ensureHeadersForSheet(sheetId, 'Registrations', registrationsHeaders)
    console.log('Registrations headers', reg.updated ? 'updated' : 'ok', reg.previous.length?('(prev: '+reg.previous.join(', ')+')'):'(was empty)')
    const fb = await ensureHeadersForSheet(sheetId, 'Feedback', feedbackHeaders)
    console.log('Feedback headers', fb.updated ? 'updated' : 'ok', fb.previous.length?('(prev: '+fb.previous.join(', ')+')'):'(was empty)')
  }catch(e){
    console.error('Header ensure failed:', e.message)
    process.exit(1)
  }
}

run()
