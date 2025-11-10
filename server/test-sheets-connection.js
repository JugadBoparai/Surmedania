#!/usr/bin/env node

/**
 * Google Sheets Connection Test Script
 * 
 * This script tests your Google Sheets configuration without making any changes.
 * Run: node test-sheets-connection.js
 */

require('dotenv').config()
const { google } = require('googleapis')
const fs = require('fs')

console.log('🔍 Testing Google Sheets Configuration...\n')

// Check environment variables
console.log('1️⃣ Checking environment variables:')
console.log(`   SHEET_ID: ${process.env.SHEET_ID ? '✅ Set' : '❌ Missing'}`)
console.log(`   GOOGLE_CREDENTIALS_FILE: ${process.env.GOOGLE_CREDENTIALS_FILE ? '✅ Set' : '❌ Missing'}`)

if (!process.env.SHEET_ID) {
  console.error('\n❌ ERROR: SHEET_ID is not set in your .env file')
  console.log('   Add: SHEET_ID=your_sheet_id_here')
  process.exit(1)
}

if (!process.env.GOOGLE_CREDENTIALS_FILE) {
  console.error('\n❌ ERROR: GOOGLE_CREDENTIALS_FILE is not set')
  console.log('   Add: GOOGLE_CREDENTIALS_FILE=/path/to/service-account-key.json')
  process.exit(1)
}

// Check if credentials file exists
console.log('\n2️⃣ Checking credentials file:')
const credPath = process.env.GOOGLE_CREDENTIALS_FILE
console.log(`   Path: ${credPath}`)

if (!fs.existsSync(credPath)) {
  console.error(`   ❌ File not found!`)
  console.log(`   Make sure the file exists at: ${credPath}`)
  process.exit(1)
}
console.log('   ✅ File exists')

// Try to read and parse the credentials
console.log('\n3️⃣ Reading credentials file:')
try {
  const credJson = JSON.parse(fs.readFileSync(credPath, 'utf8'))
  console.log(`   ✅ Valid JSON`)
  console.log(`   Service Account: ${credJson.client_email}`)
  console.log(`   Project ID: ${credJson.project_id}`)
  
  // Test authentication
  console.log('\n4️⃣ Testing Google Sheets API authentication:')
  
  const jwtClient = new google.auth.JWT(
    credJson.client_email,
    null,
    credJson.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  )
  
  jwtClient.authorize()
    .then(() => {
      console.log('   ✅ Authentication successful!')
      
      // Try to read the sheet
      console.log('\n5️⃣ Testing sheet access:')
      const sheets = google.sheets({ version: 'v4', auth: jwtClient })
      
      return sheets.spreadsheets.get({
        spreadsheetId: process.env.SHEET_ID
      })
    })
    .then((response) => {
      console.log('   ✅ Sheet access successful!')
      console.log(`   Sheet title: "${response.data.properties.title}"`)
      console.log(`   Sheet count: ${response.data.sheets.length}`)
      
      // Check if Sheet1 exists and has headers
      const sheet1 = response.data.sheets.find(s => s.properties.title === 'Sheet1')
      if (sheet1) {
        console.log(`   ✅ Sheet1 found`)
      } else {
        console.log(`   ⚠️  Sheet1 not found - make sure you have a sheet named "Sheet1"`)
      }
      
      console.log('\n✅ ALL TESTS PASSED!')
      console.log('\n📝 Your Google Sheets integration is ready to use.')
      console.log('   When a registration is submitted, it will automatically')
      console.log('   be added to your Google Sheet.\n')
      
      console.log('📋 Quick Reference:')
      console.log(`   Sheet URL: https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}`)
      console.log(`   Service Account: ${credJson.client_email}`)
      console.log('\n⚠️  Make sure you shared the sheet with the service account email!')
    })
    .catch((err) => {
      console.error('   ❌ Error accessing sheet:')
      console.error(`   ${err.message}`)
      
      if (err.message.includes('Requested entity was not found')) {
        console.log('\n💡 Possible solutions:')
        console.log('   1. Check that SHEET_ID is correct')
        console.log('   2. Make sure you shared the sheet with:')
        console.log(`      ${credJson.client_email}`)
        console.log('   3. Give the service account "Editor" permissions')
      } else if (err.message.includes('insufficient authentication')) {
        console.log('\n💡 Possible solutions:')
        console.log('   1. Check that the private key is correct')
        console.log('   2. Make sure Google Sheets API is enabled in your project')
        console.log('   3. Regenerate the service account key if needed')
      }
      
      process.exit(1)
    })
} catch (err) {
  console.error(`   ❌ Error reading credentials: ${err.message}`)
  console.log('\n💡 Make sure the JSON file is valid and not corrupted')
  process.exit(1)
}
