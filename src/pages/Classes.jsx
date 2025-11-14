import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClassCard from '../components/ClassCard'
import Breadcrumb from '../components/Breadcrumb'
import SEO from '../components/SEO'
import { useLang } from '../context/LanguageContext'
import classContent from '../data/classes.json'
import { getLocalized } from '../utils/i18n'
import holidaysData from '../data/holidays.json'
import newsData from '../data/news.json'

export default function Classes(){
  const { t, lang } = useLang()
  const [currentDate, setCurrentDate] = useState(new Date())
  // Per-section expand/collapse for class details
  const [showThuDetails, setShowThuDetails] = useState(false)
  const [showSunDetails, setShowSunDetails] = useState(false)
  const events = newsData

  // Holidays loaded from data file
  const holidays = useMemo(() => {
    const map = {}
    holidaysData.forEach(h => { map[h.date] = h.name })
    return map
  }, [])

  const calendar = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() // 0=Sunday
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 // Monday=0
    
    const days = []
    // Empty cells before month starts
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null)
    }
    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return { year, month, days, firstDay, lastDay }
  }, [currentDate])

  const getDayInfo = (day) => {
    if (!day) return null
    const dateStr = `${calendar.year}-${String(calendar.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayOfWeek = new Date(calendar.year, calendar.month, day).getDay()
    
    const info = {
      date: dateStr,
      isThursday: dayOfWeek === 4,
      isSunday: dayOfWeek === 0,
      holiday: holidays[dateStr],
      events: events.filter(e => e.date === dateStr)
    }
    
    return info
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(calendar.year, calendar.month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(calendar.year, calendar.month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = t('date.months') || []
  const dayNames = t('date.daysShort') || []
  
  const Details = ({ title, items, icon = null }) => {
    if (!items || !items.length) return null
    return (
      <div className="h-full flex flex-col rounded-lg border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-heading text-sm sm:text-base text-deepblack">{title}</h4>
        </div>
        <ul className="text-xs sm:text-sm text-black/70 space-y-2 flex-1">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{getLocalized(it, lang)}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <SEO 
        title="Classes & Schedule"
        description="View our weekly Bhangra dance class schedule at Marikollen Kultursal in Rælingen. Thursday and Sunday sessions for all skill levels. Check our calendar for upcoming events and holidays."
        keywords="bhangra classes, dance schedule rælingen, thursday dance class, sunday dance class, marikollen kultursal"
        canonicalPath="/classes"
      />
      <Breadcrumb items={[{ label: t('nav.classes') || 'Classes', path: '/classes' }]} />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
          {t('nav.classes')}
        </h1>
        <p className="text-gold font-medium tracking-wide text-xs sm:text-sm">
          {t('classes.subtitle')}
        </p>
      </motion.div>
      {/* Class sections (about the class; time lives in calendar below) */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {/* Thursday */}
          <div className="bg-gold/10 rounded-lg">
            <ClassCard
              title={t('classes.thursday') || 'Thursday Session'}
              classDay="Thursday"
            >
            <div className="mt-4 text-xs sm:text-sm text-black/70 leading-relaxed">
              <p className="mb-2">
                {showThuDetails
                  ? getLocalized(classContent.thursday.description, lang)
                  : (getLocalized(classContent.thursday.description, lang) || '').slice(0, 160) + ((getLocalized(classContent.thursday.description, lang) || '').length > 160 ? '…' : '')}
              </p>
              {/* Old reminders (restored) */}
              <div className="mt-2 flex flex-wrap gap-2 font-heading italic text-[0.65rem] sm:text-xs text-black/70">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t('classes.reminders.allLevels', 'All levels welcome')}
                </span>
                <span className="text-black/30">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Bring water
                </span>
                <span className="text-black/30">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t('classes.reminders.goodVibes', 'Remember good vibes')}
                </span>
              </div>
              {/* Centered arrow toggle */}
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  aria-expanded={showThuDetails}
                  aria-controls="thu-details"
                  aria-label={showThuDetails ? t('classes.showLess', 'Show Less') : t('classes.showMore', 'Show more')}
                  onClick={() => setShowThuDetails(v => !v)}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gold/40 text-gold hover:border-gold/60 hover:bg-gold/10 transition-colors active:scale-95"
                >
                  {showThuDetails ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  )}
                </button>
              </div>
              <AnimatePresence initial={false}>
                {showThuDetails && (
                  <motion.div
                    id="thu-details"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mt-5 rounded-xl border border-gold/20 bg-white/60 backdrop-blur-[2px] p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                        <Details
                          title={t('classes.details.expect', 'What to expect')}
                          items={classContent.thursday.details?.expectations}
                          icon={(
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8"/></svg>
                            </span>
                          )}
                        />
                        <Details
                          title={t('classes.details.who', 'Who it’s for')}
                          items={classContent.thursday.details?.who}
                          icon={(
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M7 7a4 4 0 118 0 4 4 0 01-8 0z"/></svg>
                            </span>
                          )}
                        />
                        <Details
                          title={t('classes.details.bring', 'What to bring')}
                          items={classContent.thursday.details?.bring}
                          icon={(
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11H5a2 2 0 00-2 2v6h13v-6a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4"/></svg>
                            </span>
                          )}
                        />
                        {/* Fourth box: More info */}
                        <div className="h-full flex flex-col rounded-lg border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                            </span>
                            <h4 className="font-heading text-sm sm:text-base text-deepblack">{t('classes.details.more', 'More info')}</h4>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed text-black/70 flex-1">{getLocalized(classContent.thursday.description, lang)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ClassCard>
          </div>

          {/* Sunday */}
          <div className="bg-purple-50 rounded-lg">
            <ClassCard
              title={t('classes.sunday') || 'Sunday Session'}
              classDay="Sunday"
            >
            <div className="mt-4 text-xs sm:text-sm text-black/70 leading-relaxed">
              <p className="mb-2">
                {showSunDetails
                  ? getLocalized(classContent.sunday.description, lang)
                  : (getLocalized(classContent.sunday.description, lang) || '').slice(0, 160) + ((getLocalized(classContent.sunday.description, lang) || '').length > 160 ? '…' : '')}
              </p>
              {/* Old reminders (restored) */}
              <div className="mt-2 flex flex-wrap gap-2 font-heading italic text-[0.65rem] sm:text-xs text-black/70">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t('classes.reminders.beginners', 'Beginners welcome')}
                </span>
                <span className="text-black/30">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {t('classes.reminders.parentsObserve', 'Parents may observe')}
                </span>
                <span className="text-black/30">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Bring water
                </span>
              </div>
              {/* Centered arrow toggle */}
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  aria-expanded={showSunDetails}
                  aria-controls="sun-details"
                  aria-label={showSunDetails ? t('classes.showLess', 'Show Less') : t('classes.showMore', 'Show more')}
                  onClick={() => setShowSunDetails(v => !v)}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gold/40 text-gold hover:border-gold/60 hover:bg-gold/10 transition-colors active:scale-95"
                >
                  {showSunDetails ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  )}
                </button>
              </div>
              <AnimatePresence initial={false}>
                {showSunDetails && (
                  <motion.div
                    id="sun-details"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mt-5 rounded-xl border border-gold/20 bg-white/60 backdrop-blur-[2px] p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                        <Details
                          title={t('classes.details.expect', 'What to expect')}
                          items={classContent.sunday.details?.expectations}
                          icon={(
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8"/></svg>
                            </span>
                          )}
                        />
                        <Details
                          title={t('classes.details.who', 'Who it’s for')}
                          items={classContent.sunday.details?.who}
                          icon={(
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M7 7a4 4 0 118 0 4 4 0 01-8 0z"/></svg>
                            </span>
                          )}
                        />
                        <Details
                          title={t('classes.details.bring', 'What to bring')}
                          items={classContent.sunday.details?.bring}
                          icon={(
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11H5a2 2 0 00-2 2v6h13v-6a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4"/></svg>
                            </span>
                          )}
                        />
                        {/* Fourth box: More info */}
                        <div className="h-full flex flex-col rounded-lg border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                            </span>
                            <h4 className="font-heading text-sm sm:text-base text-deepblack">{t('classes.details.more', 'More info')}</h4>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed text-black/70 flex-1">{getLocalized(classContent.sunday.description, lang)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ClassCard>
          </div>
        </motion.div>
      </div>

      {/* Interactive Monthly Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <h3 className="font-heading text-xl sm:text-2xl mb-4">{t('classes.scheduleTitle') || 'Class Schedule'}</h3>
        <div className="pb-20">
          <div className="lux-card">{/* removed overflow-hidden */}
            {/* Calendar Header with Navigation */}
            <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 px-3 py-2 border-b border-gold/20 rounded-t-lg">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1.5 hover:bg-gold/20 rounded-lg transition-colors"
                  aria-label={t('classes.prevMonth')}
                >
                  <svg className="w-4 h-4 text-deepblack" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-heading text-sm sm:text-base text-deepblack">
                    {monthNames[calendar.month]} {calendar.year}
                  </h4>
                  <button
                    onClick={goToToday}
                    className="text-[10px] px-2 py-0.5 bg-gold/20 hover:bg-gold/30 rounded-full transition-colors text-deepblack font-medium"
                  >
                    {t('classes.todayButton')}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      // Generate full calendar .ics with all events and recurring classes
                      const icsEvents = []
                      
                      // Add all events
                      events.forEach(event => {
                        const title = event.title ? (event.title[lang] || event.title.en) : ''
                        const desc = event.description ? (event.description[lang] || event.description.en || '') : ''
                        const dateStr = event.date.replace(/-/g, '')
                        icsEvents.push([
                          'BEGIN:VEVENT',
                          `DTSTART;VALUE=DATE:${dateStr}`,
                          `SUMMARY:${title}`,
                          `DESCRIPTION:${desc || ''}`,
                          `LOCATION:${event.location || 'Ravinen, Rælingen'}`,
                          'END:VEVENT'
                        ].join('\r\n'))
                      })
                      
                      // Add recurring Thursday class (Adults)
                      icsEvents.push([
                        'BEGIN:VEVENT',
                        'DTSTART:20251113T190000',
                        'DTEND:20251113T210000',
                        `SUMMARY:${t('classes.classLabel')} - ${t('classes.thursdayAudience')}`,
                        'RRULE:FREQ=WEEKLY;BYDAY=TH',
                        'LOCATION:Ravinen, Rælingen',
                        'END:VEVENT'
                      ].join('\r\n'))
                      
                      // Add recurring Sunday class (Kids)
                      icsEvents.push([
                        'BEGIN:VEVENT',
                        'DTSTART:20251116T150000',
                        'DTEND:20251116T170000',
                        `SUMMARY:${t('classes.classLabel')} - ${t('classes.sundayAudience')}`,
                        'RRULE:FREQ=WEEKLY;BYDAY=SU',
                        'LOCATION:Ravinen, Rælingen',
                        'END:VEVENT'
                      ].join('\r\n'))
                      
                      const icsContent = [
                        'BEGIN:VCALENDAR',
                        'VERSION:2.0',
                        'PRODID:-//Surmedania//Class Schedule//EN',
                        'CALSCALE:GREGORIAN',
                        'METHOD:PUBLISH',
                        'X-WR-CALNAME:Surmedania Dance Classes',
                        'X-WR-TIMEZONE:Europe/Oslo',
                        icsEvents.join('\r\n'),
                        'END:VCALENDAR'
                      ].join('\r\n')
                      
                      const blob = new Blob([icsContent], { type: 'text/calendar' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'Surmedania_Classes.ics'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="p-1.5 hover:bg-gold/20 rounded-lg transition-colors group"
                    title={t('classes.downloadFullCalendar')}
                  >
                    <svg className="w-4 h-4 text-deepblack group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={goToNextMonth}
                    className="p-1.5 hover:bg-gold/20 rounded-lg transition-colors"
                    aria-label={t('classes.nextMonth')}
                  >
                    <svg className="w-4 h-4 text-deepblack" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Calendar Body */}
            <div className="divide-y divide-gray-200 overflow-visible">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50 text-center text-xs sm:text-sm font-semibold text-deepblack/60 py-2">
                {dayNames.map((day, i) => (
                  <div key={i} className="py-1">{day}</div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 overflow-visible">
                {calendar.days.map((day, idx) => {
                  if (!day) {
                    return (
                      <div key={`empty-${idx}`} className="h-16 sm:h-20 md:h-24 border-r border-b border-gray-100 bg-gray-50/30"></div>
                    )
                  }
                  
                  const info = getDayInfo(day)
                  const today = new Date()
                  const isToday = 
                    day === today.getDate() &&
                    calendar.month === today.getMonth() &&
                    calendar.year === today.getFullYear()
                  
                  const hasHoliday = !!info.holiday
                  const hasEvent = info.events.length > 0
                  // Events and holidays override regular classes
                  const hasAdultClass = !hasHoliday && !hasEvent && info.isThursday
                  const hasKidsClass = !hasHoliday && !hasEvent && info.isSunday
                  
                  // Determine column position for tooltip positioning (0-6, where 6 is Sunday/last column)
                  const colIndex = (idx - calendar.days.filter(d => d === null).length) % 7
                  const isRightEdge = colIndex >= 5
                  
                  return (
                    <div
                      key={day}
                      className={`h-16 sm:h-20 md:h-24 border-r border-b border-gray-100 p-1 sm:p-2 relative group cursor-pointer transition-colors ${
                        hasEvent ? 'bg-blue-50 hover:bg-blue-100' :
                        hasHoliday ? 'bg-red-50 hover:bg-red-100' :
                        hasAdultClass ? 'bg-gold/10 hover:bg-gold/20' :
                        hasKidsClass ? 'bg-purple-50 hover:bg-purple-100' :
                        'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-xs sm:text-sm font-medium ${isToday ? 'bg-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : 'text-deepblack'}`}>
                        {day}
                      </div>
                      
                      {/* Class indicators */}
                      {hasAdultClass && (
                        <div className="text-[10px] sm:text-xs font-semibold text-gold leading-tight mt-1">
                          19:00
                        </div>
                      )}
                      {hasKidsClass && (
                        <div className="text-[10px] sm:text-xs font-semibold text-purple-600 leading-tight mt-1">
                          15:00
                        </div>
                      )}
                      
                      {/* Event indicators */}
                      {hasEvent && (
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      )}
                      {hasHoliday && (
                        <div className="absolute bottom-0.5 right-0.5 text-[10px] leading-none">🎉</div>
                      )}
                      
                      {/* Add to Calendar button */}
                      {(hasAdultClass || hasKidsClass || hasEvent) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle add to calendar
                            const dateStr = info.date
                              const title = hasEvent 
                                ? ((info.events[0].title && (info.events[0].title[lang] || info.events[0].title.en)) || '')
                                : hasAdultClass 
                                  ? `${t('classes.classLabel')} - ${t('classes.thursdayAudience')}`
                                  : `${t('classes.classLabel')} - ${t('classes.sundayAudience')}`
                            const time = hasAdultClass ? '19:00' : hasKidsClass ? '15:00' : ''
                            
                            // Simple .ics download
                            const icsContent = [
                              'BEGIN:VCALENDAR',
                              'VERSION:2.0',
                              'BEGIN:VEVENT',
                              `DTSTART:${dateStr.replace(/-/g, '')}${time ? 'T' + time.replace(':', '') + '00' : ''}`,
                              `SUMMARY:${title}`,
                              `LOCATION:${hasEvent && info.events[0].location ? info.events[0].location : 'Ravinen, Rælingen'}`,
                              'END:VEVENT',
                              'END:VCALENDAR'
                            ].join('\r\n')
                            
                            const blob = new Blob([icsContent], { type: 'text/calendar' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${title.replace(/\s+/g, '_')}.ics`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="absolute bottom-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-white/90 rounded hover:bg-gold/20"
                          title={t('news.addToCalendar')}
                        >
                          <svg className="w-3 h-3 text-deepblack" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Tooltip on hover */}
                      {(hasAdultClass || hasKidsClass || hasEvent || hasHoliday) && (
                        <div className={`absolute bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none ${
                          isRightEdge ? 'right-0' : 'left-1/2 -translate-x-1/2'
                        }`}>
                          <div className="bg-deepblack text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                            <div className="font-semibold mb-1">{day} {monthNames[calendar.month]}</div>
                            
                            {hasHoliday && (
                              <div className="text-red-300 text-[10px] mb-1">
                                🎉 {info.holiday[lang] || info.holiday['en']}
                              </div>
                            )}
                            
                            {hasAdultClass && (
                              <div className="text-gold text-[10px] mb-1">
                                • {t('classes.thursdayTime')} - {t('classes.thursdayAudience')}
                              </div>
                            )}
                            {hasKidsClass && (
                              <div className="text-purple-300 text-[10px] mb-1">
                                • {t('classes.sundayTime')} - {t('classes.sundayAudience')}
                              </div>
                            )}
                            
                            {info.events.map((event, i) => (
                              <div key={i} className="text-blue-300 text-[10px] mb-1">
                                📅 {event.title ? (event.title[lang] || event.title.en) : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 rounded-b-lg">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center text-[9px] sm:text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-gold/20 border border-gold/40"></div>
                  <span className="text-deepblack/70">{t('classes.legendAdults')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-purple-100 border border-purple-300"></div>
                  <span className="text-deepblack/70">{t('classes.legendKids')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-blue-100 border border-blue-300"></div>
                  <span className="text-deepblack/70">{t('classes.legendEvents')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-red-100 border border-red-300"></div>
                  <span className="text-deepblack/70">{t('classes.legendHolidays')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Location Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-4 rounded-lg" 
        id="location"
        tabIndex={-1}
        aria-label={`${t('classes.locationTitle') || 'Location'} - ${t('classes.location')}`}
      >
        <h3 className="font-heading text-xl sm:text-2xl mb-4">{t('classes.locationTitle') || (t('nav.classes') + ' location')}</h3>
        <div className="lux-card p-2">
          <div className="aspect-video w-full rounded overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2001.5892543821!2d11.086841876632247!3d59.95244277491658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464170a5e5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2s%C3%98vre%20R%C3%A6lingsveg%20203%2C%202008%20Fjerdingby!5e0!3m2!1sen!2sno!4v1699999999999!5m2!1sen!2sno"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ravinen, Rælingen Location"
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="p-4">
            <p className="font-semibold text-base sm:text-lg">{t('classes.location')}</p>
            <p className="text-xs sm:text-sm text-black/60 mt-1">Øvre Rælingsveg 203, 2008 Fjerdingby</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
