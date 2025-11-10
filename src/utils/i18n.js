export function getLocalized(obj, lang) {
  if (!obj || typeof obj !== 'object') return ''
  if (obj[lang] !== undefined && obj[lang] !== null && obj[lang] !== '') return obj[lang]
  if (obj.en !== undefined && obj.en !== null) return obj.en
  const vals = Object.values(obj)
  return (vals.length ? String(vals[0]) : '')
}
