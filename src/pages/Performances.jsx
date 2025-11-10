import React, { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { getLocalized } from '../utils/i18n'

export default function Performances(){
  const { lang, t } = useLang()
  const [list, setList] = useState([])

  useEffect(()=>{
    fetch('/src/data/performances.json').then(r=>r.json()).then(setList)
  },[])

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
  <h2 className="font-heading text-2xl sm:text-3xl mb-6 sm:mb-8">{t('performances.title')}</h2>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {list.map(p => (
          <div key={p.id} className="lux-card p-5 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="font-heading text-base sm:text-lg leading-tight">{getLocalized(p.title, lang)}</div>
            <div className="mt-1 text-sm sm:text-base text-black/60">{p.date} • {p.location}</div>
            <div className="mt-3 text-sm sm:text-base text-black/70 leading-relaxed">{getLocalized(p.description, lang)}</div>
            <div className="mt-4">
              <a href="/gallery" className="inline-flex items-center gap-1 text-gold font-medium hover:gap-2 transition-all">
                <span>{t('performances.relatedMedia')}</span>
                <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
