import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { getLocalized } from '../utils/i18n'
import newsData from '../data/news.json'

export default function Hero(){
  const { t, lang } = useLang()
  const [news, setNews] = useState(newsData)

  const today = useMemo(()=> new Date(), [])
  const nextEvent = useMemo(() => {
    const upcoming = news.filter(i => new Date(i.date + 'T00:00:00') >= today)
    upcoming.sort((a,b) => new Date(a.date) - new Date(b.date))
    return upcoming[0]
  }, [news, today])

  const daysRemaining = useMemo(() => {
    if(!nextEvent) return null
    const eventDate = new Date(nextEvent.date + 'T00:00:00')
    // Zero out times for accurate diff
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfEvent = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    const diffMs = startOfEvent - startOfToday
    return Math.round(diffMs / (1000*60*60*24))
  }, [nextEvent, today])

  function formatDate(dateStr){
    try{
      const localeMap = { en: 'en-GB', no: 'no-NO', pa: 'pa-IN' }
      const locale = localeMap[lang] || 'en-GB'
      return new Date(dateStr + 'T00:00:00').toLocaleDateString(
        locale,
        { year:'numeric', month:'short', day:'numeric' }
      )
    }catch{
      return dateStr
    }
  }

  function escapeICS(text=''){
    return String(text)
      .replaceAll('\\', '\\\\')
      .replaceAll(';', '\\;')
      .replaceAll(',', '\\,')
      .replaceAll('\n', '\\n')
  }

  function downloadICS(item){
    if(!item) return
    const dt = new Date(item.date + 'T00:00:00')
    const pad = n => String(n).padStart(2,'0')
    const y = dt.getUTCFullYear(); const m = pad(dt.getUTCMonth()+1); const d = pad(dt.getUTCDate())
    const dtEnd = new Date(dt.getTime() + 24*60*60*1000)
    const ye = dtEnd.getUTCFullYear(); const me = pad(dtEnd.getUTCMonth()+1); const de = pad(dtEnd.getUTCDate())
  const summary = getLocalized(item.title, lang) || t('common.event')
    const description = getLocalized(item.description, lang) || ''
    const location = item.location || ''
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-\u002F\u002FSurmedania\u002F\u002FNewsEvents\u002F\u002FEN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${y}${m}${d}`,
      `DTEND;VALUE=DATE:${ye}${me}${de}`,
      `SUMMARY:${escapeICS(summary)}`,
      description ? `DESCRIPTION:${escapeICS(description)}` : 'DESCRIPTION:',
      location ? `LOCATION:${escapeICS(location)}` : 'LOCATION:',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    const blob = new Blob([ics], { type:'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${summary.replace(/\s+/g,'_')}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(()=> URL.revokeObjectURL(url), 0)
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold/5 via-gold/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold/5 via-gold/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 flex flex-col">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center flex-shrink-0">
          <motion.div 
            initial={{ opacity:0, y:30 }} 
            animate={{ opacity:1, y:0 }} 
            transition={{ duration:0.8, ease: "easeOut" }} 
            className="md:max-w-none space-y-4 sm:space-y-5"
          >
            {/* Main heading with gradient */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-br from-black via-black/90 to-black/70 bg-clip-text text-transparent">
                {t('hero.tagline')}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-black/70 leading-relaxed max-w-xl">
              {t('hero.description')}
            </p>

            {/* Key features */}
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-black/70">{t('hero.features.allLevels')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-black/70">{t('hero.features.weeklyClasses')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-black/70">{t('hero.features.expertInstructors')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link 
                to="/classes" 
                className="px-6 py-3 rounded-xl border-2 border-gold/30 text-black/80 text-sm font-medium hover:bg-gold/5 hover:border-gold transition-all active:scale-95"
              >
                {t('hero.viewClasses')}
              </Link>
              <Link 
                to="/registration" 
                className="group relative px-6 py-3 rounded-xl bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">{t('hero.registerNow')}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Next Event Preview Card */}
            {nextEvent && (
              <motion.div 
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.4 }}
                className="relative group rounded-xl overflow-hidden bg-gradient-to-br from-gold/5 via-white/60 to-gold/10 backdrop-blur-md border border-gold/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-50" />
                
                <div className="relative p-4 sm:p-5">
                  {/* Header with badge and countdown */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-6 bg-gradient-to-b from-gold to-gold/50 rounded-full" />
                      <div>
                        <span className="block text-[10px] font-medium uppercase tracking-wider text-gold/70 mb-0.5">
                          {t('common.upcoming')}
                        </span>
                        <h4 className="font-heading text-sm sm:text-base font-semibold text-black/90 leading-tight">
                          {getLocalized(nextEvent.title, lang)}
                        </h4>
                      </div>
                    </div>
                    {daysRemaining !== null && (
                      <div className="flex flex-col items-end">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${daysRemaining <= 1 ? 'bg-gradient-to-r from-gold to-[#B8902F] text-white shadow-md' : 'bg-gold/10 text-gold'}`}>
                          {(() => {
                            if(daysRemaining < 0) return t('news.status.passed')
                            if(daysRemaining === 0) return t('news.status.today')
                            if(daysRemaining === 1) return t('news.status.tomorrow')
                            return `${daysRemaining}d`
                          })()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event details */}
                  <div className="flex items-center gap-2 text-xs text-black/70 mb-3 pl-3">
                    <div className="flex items-center gap-1">
                      <CalendarMini className="w-3.5 h-3.5 text-gold" />
                      <span className="font-medium">{formatDate(nextEvent.date)}</span>
                    </div>
                    {nextEvent.location && (
                      <>
                        <span className="text-gold/50">•</span>
                        <span className="truncate">{nextEvent.location}</span>
                      </>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pl-3">
                    <button 
                      onClick={()=>downloadICS(nextEvent)} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold to-[#B8902F] text-white text-xs font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      <CalendarMini className="w-3.5 h-3.5" />
                      <span>{t('news.addToCalendar')}</span>
                    </button>
                    <Link 
                      to="/news" 
                      className="inline-flex items-center gap-0.5 text-xs text-gold hover:text-gold/80 font-medium group/link transition-colors"
                    >
                      <span>{t('common.all')}</span>
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>

                {/* Subtle shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" style={{transition: 'transform 0.8s'}} />
              </motion.div>
            )}
          </motion.div>

          {/* Right column - Hero image */}
          <motion.div 
            initial={{ opacity:0, scale:0.95 }} 
            animate={{ opacity:1, scale:1 }} 
            transition={{ duration:0.8, delay:0.2 }} 
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 pointer-events-none z-10" />
              <img 
                src="/hero.jpg" 
                alt={t('hero.imageAlt')} 
                className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover"
              />
            </div>
            {/* Floating accent element */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>

        {/* Three Info Boxes - Bottom of viewport */}
        <div className="mt-8 sm:mt-10">
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            <motion.div 
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.6, duration:0.5 }}
              className="lux-card p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm sm:text-base mb-1.5 text-black/90">{t('classes.locationTitle')}</h3>
                  <p className="text-xs text-black/70 leading-relaxed">Ravinen, Rælingen<br/>Øvre Rælingsveg 203, 2008 Fjerdingby</p>
                  <div className="mt-3">
                    <Link to="/classes#location" className="inline-flex items-center gap-1 text-gold font-semibold hover:gap-2 transition-all text-xs">
                      <span>{t('common.viewOnMap')}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.7, duration:0.5 }}
              className="lux-card p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm sm:text-base mb-1.5 text-black/90">{t('feedback.title')}</h3>
                  <p className="text-xs text-black/70 leading-relaxed">{t('feedback.excerpt')}</p>
                  <div className="mt-3">
                    <Link to="/feedback" className="inline-flex items-center gap-1 text-gold font-semibold hover:gap-2 transition-all text-xs">
                      <span>{t('feedback.ctaLink')}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.8, duration:0.5 }}
              className="lux-card p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm sm:text-base mb-1.5 text-black/90">{t('support.title')}</h3>
                  <p className="text-xs text-black/70 leading-relaxed">{t('support.description')}</p>
                  <div className="mt-3">
                    <Link to="/registration?type=supported" className="inline-flex items-center gap-1 text-gold font-semibold hover:gap-2 transition-all text-xs">
                      <span>{t('support.now')}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CalendarMini({ className }){
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || 'w-4 h-4 text-black/50'}>
      <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a3 3 0 013 3v11a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h1V3a1 1 0 011-1zm13 8H4v8a1 1 0 001 1h14a1 1 0 001-1v-8zM5 9h14V7a1 1 0 00-1-1h-1v1a1 1 0 11-2 0V6H9v1a1 1 0 11-2 0V6H6a1 1 0 00-1 1v2z" />
    </svg>
  )
}
