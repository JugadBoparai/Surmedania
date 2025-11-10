require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { appendToSheet, ensureHeadersForSheet } = require('./googleSheets')
const fs = require('fs')
const { createObjectCsvWriter } = require('csv-writer')
const path = require('path')
const { createPayment, getPaymentStatus } = require('./vippsPayment')
const { sendThankYouEmail } = require('./emailService')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const CSV_PATH = path.join(__dirname, 'registrations.csv')

// Format: dd.mm.yyyy kl. HH.MM.SS
function formatTimestampNO(date = new Date()){
  const pad = n => String(n).padStart(2, '0')
  const dd = pad(date.getDate())
  const mm = pad(date.getMonth()+1)
  const yyyy = date.getFullYear()
  const HH = pad(date.getHours())
  const MM = pad(date.getMinutes())
  const SS = pad(date.getSeconds())
  return `${dd}.${mm}.${yyyy} kl. ${HH}.${MM}.${SS}`
}

app.post('/webhook', async (req, res) => {
  const data = req.body
  // Basic validation
  if(!data || !data.name || !data.email) return res.status(400).json({ error: 'Missing required fields' })

  // Try appending to Google Sheets if configured
  try{
    // Use Google Sheets if a SHEET_ID is provided and either direct env creds or a credentials file is set
    const hasDirectCreds = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    const hasCredsFile = process.env.GOOGLE_CREDENTIALS_FILE
    if(process.env.SHEET_ID && (hasDirectCreds || hasCredsFile)){
      const now = new Date()
      const readableTimestamp = formatTimestampNO(now)
      
      // Format data as row matching CSV structure
      // For supported members, place relation after comments/notes
      let rowData
      if(data.memberType === 'supported'){
        rowData = [
          readableTimestamp,
          data.name || '',
          data.email || '',
          data.phone || '',
          data.dob || '',
          data.memberType || '',
          data.classSelection || '',
          data.experience || data.skillLevel || '',
          data.relation || '', // Save relation text under Comments / Notes
          '', // Relasjon til student (valgfritt) column left blank
          data.paymentAmount || '',
          data.paymentStatus || ''
        ]
      }else{
        rowData = [
          readableTimestamp,
          data.name || '',
          data.email || '',
          data.phone || '',
          data.dob || '',
          data.memberType || '',
          data.classSelection || '',
          data.experience || data.skillLevel || '',
          data.comments || '',
          data.paymentAmount || '',
          data.paymentStatus || '',
          data.relation || '' // Relation at end for active
        ]
      }
      
  await appendToSheet(process.env.SHEET_ID, 'Registrations', rowData)
  console.log('[WEBHOOK] Sheets append success (Registrations):', data.email)
  return res.json({ ok: true, note: 'saved-to-sheets' })
    }
  }catch(err){
    console.error('Google Sheets append failed', err)
  }

  // Fallback: write to CSV locally
  try{
    // Define the CSV structure matching our header
    const csvWriter = createObjectCsvWriter({
      path: CSV_PATH,
      header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'name', title: 'Full Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'dob', title: 'Date of Birth' },
        { id: 'memberType', title: 'Member Type' },
        { id: 'classSelection', title: 'Class Selection' },
        { id: 'skillLevel', title: 'Skill Level' },
        { id: 'comments', title: 'Comments / Notes' },
        { id: 'relation', title: 'Relation' },
        { id: 'paymentAmount', title: 'Payment Amount' },
        { id: 'paymentStatus', title: 'Payment Status' }
      ],
      append: true
    })

    // Create record with timestamp and all form fields
    const now = new Date()
    const readableTimestamp = formatTimestampNO(now)
    
    // For supported members, place relation after comments/notes
    let record
    if(data.memberType === 'supported'){
      record = {
        timestamp: readableTimestamp,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        dob: data.dob || '',
        memberType: data.memberType || '',
        classSelection: data.classSelection || '',
        skillLevel: data.experience || data.skillLevel || '',
        comments: data.relation || '', // Save relation text under Comments / Notes
        relation: '', // Relasjon til student (valgfritt) column left blank
        paymentAmount: data.paymentAmount || '',
        paymentStatus: data.paymentStatus || ''
      }
    }else{
      record = {
        timestamp: readableTimestamp,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        dob: data.dob || '',
        memberType: data.memberType || '',
        classSelection: data.classSelection || '',
        skillLevel: data.experience || data.skillLevel || '',
        comments: data.comments || '',
        paymentAmount: data.paymentAmount || '',
        paymentStatus: data.paymentStatus || '',
        relation: data.relation || ''
      }
    }

  await csvWriter.writeRecords([record])
  console.log('[WEBHOOK] CSV append fallback (Registrations):', data.email)
    
    // Send thank you email to supported members after successful registration
    if (data.memberType === 'supported' && data.email) {
      console.log('Sending thank you email to supported member:', data.email)
      sendThankYouEmail({
        name: data.name,
        email: data.email,
        paymentAmount: data.paymentAmount || 'your generous'
      }).catch(err => {
        console.error('Email sending failed (non-blocking):', err.message)
      })
    }
    
    return res.json({ ok: true, note: 'saved-to-csv' })
  }catch(err){
    console.error('CSV write failed', err)
    return res.status(500).json({ error: 'save-failed' })
  }
})

// Feedback CSV path
const FEEDBACK_CSV_PATH = path.join(__dirname, 'feedback.csv')

// Feedback endpoint
app.post('/feedback', async (req, res) => {
  const { name, email, feedback, anonymous } = req.body
  if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
    return res.status(400).json({ error: 'Feedback is required' })
  }
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  const readableTimestamp = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()} kl. ${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`
  const csvWriter = createObjectCsvWriter({
    path: FEEDBACK_CSV_PATH,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'anonymous', title: 'Anonymous' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'feedback', title: 'Feedback' }
    ],
    append: true
  })
  const record = {
    timestamp: readableTimestamp,
    anonymous: anonymous ? 'Yes' : 'No',
    name: anonymous ? '' : (name || ''),
    email: anonymous ? '' : (email || ''),
    feedback: feedback.trim()
  }
  try {
    // If Google Sheets configured, append to Feedback sheet first
    const hasDirectCreds = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    const hasCredsFile = process.env.GOOGLE_CREDENTIALS_FILE
    if(process.env.SHEET_ID && (hasDirectCreds || hasCredsFile)){
      try{
        await appendToSheet(process.env.SHEET_ID, 'Feedback', [
          readableTimestamp,
          anonymous ? 'Yes' : 'No',
          anonymous ? '' : (name || ''),
          anonymous ? '' : (email || ''),
          feedback.trim()
        ])
        console.log('[FEEDBACK] Sheets append success (Feedback):', anonymous ? 'anonymous' : email)
        return res.json({ ok: true, note: 'saved-to-sheets' })
      }catch(e){
        console.error('Google Sheets append (feedback) failed', e)
      }
    }

  await csvWriter.writeRecords([record])
  console.log('[FEEDBACK] CSV append fallback:', anonymous ? 'anonymous' : email)
    return res.json({ ok: true, note: 'saved-to-csv' })
  } catch (err) {
    console.error('Feedback CSV write failed', err)
    return res.status(500).json({ error: 'save-failed' })
  }
})

// Vipps Payment Endpoints
app.post('/vipps/create-payment', async (req, res) => {
  const { amount, membershipType, userName, userPhone } = req.body
  
  if (!amount || !membershipType || !userName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Generate unique reference
    const reference = `SUR-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
    
    const description = `Surmedanian - ${membershipType} membership - ${userName}`
    
    const payment = await createPayment({
      amount,
      description,
      reference,
      userPhone
    })

    return res.json({
      success: true,
      reference: payment.reference,
      redirectUrl: payment.redirectUrl
    })
  } catch (error) {
    console.error('Vipps payment creation error:', error)
    return res.status(500).json({ error: 'Failed to create payment' })
  }
})

app.get('/vipps/payment-status/:reference', async (req, res) => {
  const { reference } = req.params

  try {
    const status = await getPaymentStatus(reference)
    return res.json(status)
  } catch (error) {
    console.error('Vipps payment status error:', error)
    return res.status(500).json({ error: 'Failed to get payment status' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Webhook server listening on port ${PORT}`))

// Health endpoint
app.get('/health', async (req, res) => {
  const sheetId = process.env.SHEET_ID
  const hasDirectCreds = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
  const hasCredsFile = process.env.GOOGLE_CREDENTIALS_FILE
  const sheetsConfigured = !!sheetId && (hasDirectCreds || hasCredsFile)
  let sheetsStatus = 'disabled'
  let registrationHeadersEnsured = false
  let feedbackHeadersEnsured = false
  let errors = []

  if(sheetsConfigured){
    const registrationsHeaders = [
      'Timestamp','Full Name','Email','Phone','Date of Birth','Member Type','Class Selection','Skill Level','Kommentarer (valgfritt)','Relasjon til student (valgfritt)','Payment Amount','Payment Status'
    ]
    const feedbackHeaders = [
      'Timestamp','Anonymous','Name','Email','Feedback'
    ]
    try{
      const regResult = await ensureHeadersForSheet(sheetId, 'Registrations', registrationsHeaders)
      registrationHeadersEnsured = regResult.updated
    }catch(e){ errors.push('Registrations: '+ e.message) }
    try{
      const fbResult = await ensureHeadersForSheet(sheetId, 'Feedback', feedbackHeaders)
      feedbackHeadersEnsured = fbResult.updated
    }catch(e){ errors.push('Feedback: '+ e.message) }
    sheetsStatus = errors.length ? 'partial' : 'ok'
  }

  res.json({
    ok: true,
    sheets: sheetsStatus,
    registrationHeadersEnsured,
    feedbackHeadersEnsured,
    errors
  })
})
