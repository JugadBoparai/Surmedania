const fs = require('fs')
const path = require('path')

const CSV_PATH = path.join(__dirname, '../feedback.csv')

function formatTimestampNO(date) {
  const pad = n => String(n).padStart(2, '0')
  const dd = pad(date.getDate())
  const mm = pad(date.getMonth() + 1)
  const yyyy = date.getFullYear()
  const HH = pad(date.getHours())
  const MM = pad(date.getMinutes())
  const SS = pad(date.getSeconds())
  return `${dd}.${mm}.${yyyy} kl. ${HH}.${MM}.${SS}`
}

function tryParseTimestamp(ts) {
  if (/^\d{2}\.\d{2}\.\d{4} kl\. \d{2}\.\d{2}\.\d{2}$/.test(ts)) return ts
  let d = null
  if (/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/.test(ts)) {
    const [date, time] = ts.split(', ')
    const [dd, mm, yyyy] = date.split('/')
    const [HH, MM, SS] = time.split(':')
    d = new Date(`${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}`)
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(ts)) {
    d = new Date(ts)
  }
  if (d && !isNaN(d.getTime())) return formatTimestampNO(d)
  return ts
}

function migrateCSV() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error('feedback.csv not found')
    process.exit(1)
  }
  const lines = fs.readFileSync(CSV_PATH, 'utf8').split('\n')
  if (lines.length < 2) {
    console.log('No data rows to migrate')
    process.exit(0)
  }
  const migrated = lines.map(row => {
    if (!row.trim()) return row
    const cols = row.split(',')
    if (cols.length < 1) return row
    cols[0] = tryParseTimestamp(cols[0].replace(/"/g, ''))
    return '"' + cols[0] + '"' + (cols.length > 1 ? ',' + cols.slice(1).join(',') : '')
  })
  fs.writeFileSync(CSV_PATH, migrated.join('\n'))
  console.log(`Migrated ${migrated.length} rows in feedback.csv to Norwegian timestamp format.`)
}

migrateCSV()
