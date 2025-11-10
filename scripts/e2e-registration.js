const { chromium } = require('playwright')
const fs = require('fs')

;(async () => {
  const BASE = process.env.E2E_BASE_URL || 'http://localhost:5174'
  const WEBHOOK = process.env.VITE_WEBHOOK_URL || 'http://localhost:4000/webhook'

  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('Opening registration page...')
  // Use domcontentloaded to avoid waiting for persistent HMR websockets
  await page.goto(`${BASE}/registration`, { waitUntil: 'domcontentloaded', timeout: 30000 })

  // Fill form fields
  await page.fill('input[name="name"]', 'E2E User')
  await page.fill('input[name="email"]', 'e2e-user@example.com')
  await page.fill('input[name="phone"]', '+4711122233')

  // Ensure active member (default). Fill active fields.
  await page.fill('input[name="age"]', '28')
  await page.fill('input[name="style"]', 'Bhangra')
  await page.fill('input[name="experience"]', 'Intermediate')
  await page.fill('textarea[name="comments"]', 'E2E test')

  // Intercept webhook response
  console.log('Waiting for webhook response...')
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/webhook') && resp.status() === 200, { timeout: 5000 }),
    // Submit the form
    page.click('button[type="submit"]')
  ])

  if(response) {
    console.log('Webhook response status:', response.status())
    const body = await response.json().catch(()=>null)
    console.log('Webhook response body:', body)
  } else {
    console.error('No webhook response received')
  }

  // Wait for navigation to confirmation page
  try{
    await page.waitForURL('**/registration/confirm', { timeout: 3000 })
    console.log('Navigation to confirmation page confirmed')
  }catch(e){
    console.warn('Did not navigate to confirmation page within timeout')
  }

  await browser.close()

  // Show last line of server CSV if exists
  const csvPath = './server/registrations.csv'
  if(fs.existsSync(csvPath)){
    const data = fs.readFileSync(csvPath, 'utf8').trim().split('\n')
    console.log('Last CSV row:', data[data.length-1])
  } else {
    console.log('registrations.csv not found')
  }

  process.exit(0)
})().catch(err => { console.error(err); process.exit(1) })
