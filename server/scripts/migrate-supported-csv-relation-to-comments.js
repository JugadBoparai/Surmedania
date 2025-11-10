const fs = require('fs')
const path = require('path')

const CSV_PATH = path.join(__dirname, '../registrations.csv')

function migrateCSV() {
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
  // Find column indexes
  const memberTypeIdx = header.indexOf('Member Type')
  const commentsIdx = header.indexOf('Comments / Notes')
  const relationIdx = header.indexOf('Relation')
  if (memberTypeIdx === -1 || commentsIdx === -1 || relationIdx === -1) {
    console.error('Required columns not found in header')
    process.exit(1)
  }
  const migrated = [lines[0]]
  for (let i = 1; i < lines.length; ++i) {
    const row = lines[i]
    if (!row.trim()) { migrated.push(row); continue }
    const cols = row.split(',')
    if (cols.length <= relationIdx) { migrated.push(row); continue }
    if ((cols[memberTypeIdx] || '').trim() === 'supported') {
      // Move relation to comments, blank relation
      cols[commentsIdx] = cols[relationIdx]
      cols[relationIdx] = ''
    }
    migrated.push(cols.join(','))
  }
  fs.writeFileSync(CSV_PATH, migrated.join('\n'))
  console.log(`Migrated supported member rows: relation -> comments in registrations.csv`)
}

migrateCSV()
