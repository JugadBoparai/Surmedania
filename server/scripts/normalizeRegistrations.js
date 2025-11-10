const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const CSV_IN = path.resolve(__dirname, '..', 'registrations.csv')
const CSV_OUT = path.resolve(__dirname, '..', 'registrations-clean.csv')

const targetHeaders = [
  'Timestamp',
  'Full Name',
  'Email',
  'Phone',
  'Age',
  'Member Type',
  'Class Selection',
  'Skill Level',
  'Comments / Notes',
  'Payment Status'
]

function escapeCell(v){
  if(v == null) return ''
  const s = String(v)
  // escape double quotes
  const escaped = s.replace(/"/g, '""')
  // wrap in quotes if contains comma, quote, or newline
  if(/[",\n]/.test(s)) return '"' + escaped + '"'
  return escaped
}

function isEmail(s){
  return typeof s === 'string' && /@/.test(s)
}

function mapRow(fields, headerFields){
  const out = {}
  for(const h of targetHeaders) out[h] = ''

  // Normalize header names
  const hf = headerFields.map(h=> (h||'').toString().trim().toLowerCase())

  // If header clearly maps, use header mapping
  if(hf.length && (hf.includes('timestamp') || hf.includes('time'))){
    // try to map common header names
    for(let i=0;i<hf.length;i++){
      const key = hf[i]
      const val = fields[i]
      if(!val) continue
      if(key.includes('time')) out['Timestamp'] = val
      else if(key.includes('name')) out['Full Name'] = val
      else if(key.includes('email')) out['Email'] = val
      else if(key.includes('phone')) out['Phone'] = val
      else if(key.includes('age')) out['Age'] = val
      else if(key.includes('member')) out['Member Type'] = val
      else if(key.includes('class')) out['Class Selection'] = val
      else if(key.includes('skill')) out['Skill Level'] = val
      else if(key.includes('comment') || key.includes('note')) out['Comments / Notes'] = val
      else if(key.includes('payment')) out['Payment Status'] = val
    }
    return out
  }

  // Heuristic 1: first field is timestamp
  if(fields.length > 0 && typeof fields[0] === 'string' && /\d{4}-\d{2}-\d{2}T/.test(fields[0])){
    out['Timestamp'] = fields[0]
    out['Full Name'] = fields[1] || ''
    // find email field
    for(let i=2;i<fields.length;i++){
      if(isEmail(fields[i])){ out['Email'] = fields[i]; out['Phone'] = fields[i+1]||''; break }
    }
    out['Member Type'] = fields[4] || ''
    out['Class Selection'] = fields[5] || ''
    out['Skill Level'] = fields[6] || ''
    out['Comments / Notes'] = fields[7] || ''
    return out
  }

  // Heuristic 2: row contains an email somewhere — map name before it
  const emailIdx = fields.findIndex(isEmail)
  if(emailIdx !== -1){
    out['Email'] = fields[emailIdx]
    out['Full Name'] = fields[emailIdx-1] || ''
    out['Phone'] = fields[emailIdx+1] || ''
    out['Member Type'] = fields[emailIdx+2] || ''
    out['Class Selection'] = fields[emailIdx+3] || ''
    out['Skill Level'] = fields[emailIdx+4] || ''
    out['Comments / Notes'] = fields.slice(emailIdx+5).join(' ') || ''
    return out
  }

  // Heuristic 3: match common pattern where memberType is first
  const memberIdx = fields.findIndex(f => typeof f === 'string' && /^(active|supported|student|supporter|member)$/i.test(f))
  if(memberIdx === 0 && fields.length >= 3){
    out['Member Type'] = fields[0]
    out['Full Name'] = fields[1]
    out['Email'] = fields[2]
    out['Phone'] = fields[3] || ''
    out['Age'] = fields[4] || ''
    out['Class Selection'] = fields[5] || ''
    out['Skill Level'] = fields[6] || ''
    out['Comments / Notes'] = fields.slice(7).join(' ') || ''
    return out
  }

  // Fallback: place first columns into Full Name, Email, Phone
  out['Full Name'] = fields[0] || ''
  out['Email'] = fields[1] || ''
  out['Phone'] = fields[2] || ''
  out['Comments / Notes'] = fields.slice(3).join(' ') || ''
  return out
}

function normalize(){
  if(!fs.existsSync(CSV_IN)){
    console.error('Input CSV not found:', CSV_IN)
    process.exit(1)
  }

  // Read raw content and perform quick pre-cleaning to handle concatenated rows
  let content = fs.readFileSync(CSV_IN, 'utf8')

  // 1) Remove obvious stray header fragments that sometimes appear in the file
  content = content.replace(/timestamp\s*,\s*name\s*,\s*email(?:\s*,\s*phone)?/gi, '')

  // 2) If multiple records got concatenated (e.g. "...Thursday2025-11-06T14:15:43.403Z,Timestamp Test,...")
  //    insert a newline before ISO timestamps when they're missing a separator.
  //    This looks for a digit/letter directly followed by an ISO timestamp and injects a newline.
  content = content.replace(/([^\n,])(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/g, '$1\n$2')

  // 3) Collapse multiple consecutive blank lines
  content = content.replace(/\n{2,}/g, '\n')

  const records = parse(content, { relax_column_count: true, skip_empty_lines: true })
  if(!records || records.length === 0){
    console.error('No rows parsed from CSV')
    process.exit(1)
  }

  const headerFields = records[0].map(h => (h||'').toString())
  const rows = records.slice(1)

  const outLines = []
  outLines.push(targetHeaders.join(','))

  for(const fields of rows){
    const mapped = mapRow(fields, headerFields)
    const row = targetHeaders.map(h => escapeCell(mapped[h] || ''))
    outLines.push(row.join(','))
  }

  fs.writeFileSync(CSV_OUT, outLines.join('\n'))
  console.log('Wrote', CSV_OUT)
}

normalize()

if(require.main === module){
  const out = fs.readFileSync(CSV_OUT, 'utf8')
  console.log(out.split(/\r?\n/).slice(0,50).join('\n'))
}
