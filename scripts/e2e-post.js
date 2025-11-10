const fs = require('fs')

const WEBHOOK = process.env.E2E_WEBHOOK || 'http://localhost:4000/webhook'

console.log('E2E POST script starting, webhook=', WEBHOOK)

;(async () => {
  const payload = {
    name: 'AutoPoster',
    email: 'autoposter@example.com',
    phone: '+4711999888',
    memberType: 'supported',
    classSelection: 'Sunday'
  }
  console.log('Posting to webhook:', WEBHOOK)
  const res = await global.fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const body = await res.json().catch(()=>null)
  console.log('Response status', res.status, body)

  const csvPath = './server/registrations.csv'
  if(fs.existsSync(csvPath)){
    const data = fs.readFileSync(csvPath, 'utf8').trim().split('\n')
    console.log('Last CSV row:', data[data.length-1])
  } else {
    console.log('No CSV found at', csvPath)
  }
})().catch(err => { console.error(err); process.exit(1) })
