import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import SEO from '../components/SEO'
import { useLang } from '../context/LanguageContext'
import { motion } from 'framer-motion'
import newsData from '../data/news.json'

export default function NewsPage(){
  const { lang, t } = useLang()
  const navigate = useNavigate()
  const [items, setItems] = useState(newsData)

  const today = useMemo(() => new Date(), [])
  const upcoming = useMemo(() => {
    return items.filter(i => {
      const d = new Date(i.date + 'T00:00:00')
      return d >= today
    }).sort((a,b) => new Date(a.date) - new Date(b.date))
  }, [items, today])

  const past = useMemo(() => {
    return items.filter(i => {
      const d = new Date(i.date + 'T00:00:00')
      return d < today
    }).sort((a,b) => new Date(b.date) - new Date(a.date))
  }, [items, today])

  const cardVariants = {
    hidden: { opacity:0, y:16 },
    visible: (i) => ({ opacity:1, y:0, transition:{ delay:i*0.07 } })
  }

  const featuredDaysRemaining = useMemo(() => {
    if(upcoming.length === 0) return null
    const eventDate = new Date(upcoming[0].date + 'T00:00:00')
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfEvent = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    const diffMs = startOfEvent - startOfToday
    return Math.round(diffMs / (1000*60*60*24))
  }, [upcoming, today])

    const localeMap = { en: 'en-GB', no: 'no-NO', pa: 'pa-IN' }

  function formatDate(dateStr) {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString(
          localeMap[lang] || 'en-GB',
        { year: 'numeric', month: 'short', day: 'numeric' }
      )
    } catch {
      return dateStr
    }
  }

  function getLocalizedField(obj, field){
    if(!obj) return ''
    const base = obj[field]
    if(base && typeof base === 'object'){ return base[lang] || base.en || Object.values(base)[0] || '' }
    return ''
  }

  function downloadICS(item) {
    // Create an all-day event on the given date
    const dt = new Date(item.date + 'T00:00:00')
    const pad = (n) => String(n).padStart(2, '0')
    const y = dt.getUTCFullYear()
    const m = pad(dt.getUTCMonth()+1)
    const d = pad(dt.getUTCDate())
    // End date is next day for all-day ICS
    const dtEnd = new Date(dt.getTime() + 24*60*60*1000)
    const ye = dtEnd.getUTCFullYear()
    const me = pad(dtEnd.getUTCMonth()+1)
    const de = pad(dtEnd.getUTCDate())
  const summary = getLocalizedField(item,'title') || 'Event'
  const description = getLocalizedField(item,'description') || ''
    const location = item.location || ''
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Surmedania//NewsEvents//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${y}${m}${d}`,
      `DTEND;VALUE=DATE:${ye}${me}${de}`,
      `SUMMARY:${escapeICS(summary)}`,
      description ? `DESCRIPTION:${escapeICS(description)}` : 'DESCRIPTION:' ,
      location ? `LOCATION:${escapeICS(location)}` : 'LOCATION:',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${summary.replace(/\s+/g,'_')}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  function escapeICS(text='') {
    return String(text)
      .replaceAll('\\', '\\\\')
      .replaceAll(';', '\\;')
      .replaceAll(',', '\\,')
      .replaceAll('\n', '\\n')
  }

  function relativeLabel(days){
    if(days < 0) return t('news.status.passed')
    if(days === 0) return t('news.status.today')
    if(days === 1) return t('news.status.tomorrow')
    return String(t('news.status.inDays')).replace('{count}', days)
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <SEO 
        title="News & Events"
        description="Stay updated with the latest news, performances, and upcoming events from Surmedania Dance School. Check out our event calendar and don't miss any exciting shows or workshops."
        keywords="surmedania events, dance performances, upcoming shows, bhangra events norway, dance news"
        canonicalPath="/news"
      />
      <Breadcrumb items={[{ label: t('nav.news') || 'News', path: '/news' }]} />
      
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
          {t('news.title')}
        </h1>
        <p className="text-gold font-medium tracking-wide text-xs sm:text-sm">
          {t('news.subtitle')}
        </p>
      </motion.div>

      {/* Empty State - No Events */}
      {upcoming.length === 0 && past.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="lux-card p-8 sm:p-12 text-center">
            <div className="relative inline-block mb-6">
              <div className="text-8xl text-gold/20">📅</div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            
            <h2 className="font-heading text-2xl sm:text-3xl mb-3 text-black/90">
              {t('news.noEvents') || 'No events scheduled yet'}
            </h2>
            <p className="text-black/60 mb-8 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              {t('news.noEventsMessage') || 'Stay tuned! We\'re planning exciting performances and workshops. Check back soon or follow us on social media for updates.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://www.instagram.com/surmedania"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-[#B8902F] text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span>{t('footer.instagram') || 'Follow on Instagram'}</span>
              </a>
              <button
                onClick={() => navigate('/classes')}
                className="px-6 py-3 border-2 border-gold/30 text-gold font-semibold rounded-lg hover:border-gold hover:bg-gold/5 transition-all"
              >
                {t('news.viewClasses') || 'View Classes'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Featured Event */}
      {upcoming.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 sm:mb-14"
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/30"></div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gold to-gold/80 text-white shadow-lg">
              <span className="text-lg">⭐</span>
              {t('news.nextEvent')}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/30"></div>
          </div>
          <div className="relative lux-card p-8 sm:p-10 bg-gradient-to-br from-gold/5 via-white/60 to-gold/10 border-2 border-gold/20 shadow-xl">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-full pointer-events-none"></div>
            
            <div className="relative grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-gold/20">
                    <CalendarIcon className="w-5 h-5 text-gold" />
                    <span className="text-sm font-medium text-black/80">{formatDate(upcoming[0].date)}</span>
                  </div>
                  {featuredDaysRemaining !== null && (
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold tracking-wide shadow-sm ${featuredDaysRemaining <= 1 ? 'bg-gradient-to-r from-gold to-gold/80 text-white' : 'bg-gold/15 text-gold border border-gold/30'}`}>
                      {relativeLabel(featuredDaysRemaining)}
                    </span>
                  )}
                </div>
                
                <h3 className="font-heading text-xl sm:text-2xl text-black/90 leading-tight">
                  {getLocalizedField(upcoming[0],'title')}
                </h3>
                
                {!!upcoming[0].location && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm text-sm text-black/70 border border-gold/10">
                    <PinIcon />
                    <span>{upcoming[0].location}</span>
                  </div>
                )}
                
                <p className="text-xs sm:text-sm text-black/70 leading-relaxed">
                  {getLocalizedField(upcoming[0],'description')}
                </p>
              </div>
              
              <div className="flex md:justify-end items-start">
                <button
                  onClick={()=>downloadICS(upcoming[0])}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <CalendarIcon className="w-5 h-5 text-white" />
                  <span className="text-sm">{t('news.addToCalendar')}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upcoming Events */}
      <div id="upcoming" className="mb-10 sm:mb-14">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold/50 rounded-full"></div>
            <h2 className="font-heading text-xl sm:text-2xl">{t('news.upcomingEvents')}</h2>
          </div>
          {upcoming.length > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-gold/10 text-xs sm:text-sm text-gold font-semibold border border-gold/20">
              {String(t('news.scheduledCount')).replace('{count}', upcoming.length)}
            </div>
          )}
        </div>
        {upcoming.length === 0 && loaded && (
          <div className="lux-card p-5 sm:p-6 text-sm sm:text-base text-black/60">
            {t('news.noneUpcoming')}
          </div>
        )}
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((i, idx) => (
            <motion.div
              key={i.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once:true, amount:0.2 }}
              custom={idx}
              className="group lux-card p-6 hover:shadow-xl transition-all border border-gold/20 hover:border-gold/40 hover:-translate-y-1 bg-gradient-to-br from-white/80 to-gold/5"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 text-gold text-xs font-bold border border-gold/30">
                  {t('news.badgeUpcoming')}
                </span>
              </div>
              
              <h3 className="font-heading text-base sm:text-lg leading-tight mb-3 text-black/90 group-hover:text-black transition-colors">
                {getLocalizedField(i,'title')}
              </h3>
              
              <div className="flex items-center gap-2 mb-3 text-xs text-black/60">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(i.date)}</span>
              </div>
              
              {!!i.location && (
                <div className="flex items-center gap-2 mb-3 text-xs text-black/60">
                  <PinIcon />
                  <span>{i.location}</span>
                </div>
              )}
              
              <p className="text-sm text-black/70 leading-relaxed mb-4 line-clamp-3">
                {getLocalizedField(i,'description')}
              </p>
              
              <button 
                onClick={()=>downloadICS(i)} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold hover:text-white transition-all w-full justify-center border border-gold/30"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{t('news.addToCalendar')}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Past News */}
      <div>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-black/30 to-black/10 rounded-full"></div>
            <h2 className="font-heading text-xl sm:text-2xl text-black/70">{t('news.pastEvents')}</h2>
          </div>
          {past.length > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-black/5 text-xs sm:text-sm text-black/50 font-semibold">
              {String(t('news.postedCount')).replace('{count}', past.length)}
            </div>
          )}
        </div>
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {past.map((i, idx) => (
            <motion.div
              key={i.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once:true, amount:0.2 }}
              custom={idx}
              className="lux-card p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white/60 to-black/[0.02] border border-black/5"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-black/50 text-xs font-bold">
                  {t('news.badgePast')}
                </span>
              </div>
              
              <h3 className="font-heading text-base sm:text-lg leading-tight mb-3 text-black/70">
                {getLocalizedField(i,'title')}
              </h3>
              
              <div className="flex items-center gap-2 mb-3 text-xs text-black/50">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(i.date)}</span>
              </div>
              
              {!!i.location && (
                <div className="flex items-center gap-2 mb-3 text-xs text-black/50">
                  <PinIcon />
                  <span>{i.location}</span>
                </div>
              )}
              
              <p className="text-sm text-black/60 leading-relaxed line-clamp-3">
                {getLocalizedField(i,'description')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CalendarIcon({ className }){
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-4 h-4 text-black/50"}>
      <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a3 3 0 013 3v11a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h1V3a1 1 0 011-1zm13 8H4v8a1 1 0 001 1h14a1 1 0 001-1v-8zM5 9h14V7a1 1 0 00-1-1h-1v1a1 1 0 11-2 0V6H9v1a1 1 0 11-2 0V6H6a1 1 0 00-1 1v2z" />
    </svg>
  )
}

function PinIcon(){
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black/50">
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  )
}
