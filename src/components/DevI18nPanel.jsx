import React, { useMemo, useState } from 'react'
import { useLang } from '../context/LanguageContext'

// Small floating dev-only panel that lists missing/fallback i18n keys encountered in this session.
// Only renders in development.
export default function DevI18nPanel(){
  const { _missing, lang } = useLang()
  const [open, setOpen] = useState(false)

  if (!(import.meta && import.meta.env && import.meta.env.DEV)) return null
  if (!_missing) return null

  const items = _missing
  const counts = useMemo(() => {
    const map = new Map()
    items.forEach(({ lang: l, path, type }) => {
      const key = `${l}:${path}:${type}`
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map.entries()).map(([k, count]) => {
      const [l, path, type] = k.split(':')
      return { l, path, type, count }
    })
  }, [items])

  if (counts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-3 py-1.5 rounded bg-black/80 text-white text-xs shadow-lg hover:bg-black"
        title="Toggle i18n missing keys panel"
      >
        i18n {open ? '−' : '+'} ({counts.length})
      </button>
      {open && (
        <div className="mt-2 w-[320px] max-h-[40vh] overflow-auto rounded-lg shadow-2xl border border-black/10 bg-white">
          <div className="px-3 py-2 border-b text-xs font-semibold bg-black/5">Missing/Fallback keys</div>
          <ul className="text-[11px] leading-snug p-2 space-y-1">
            {counts.map(({ l, path, type, count }, i) => (
              <li key={i} className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block px-1.5 py-0.5 mr-1 rounded ${type==='missing' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>{type}</span>
                  <code className="text-black/80">{path}</code>
                </div>
                <div className="text-black/50">{l}{count>1?` ×${count}`:''}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
