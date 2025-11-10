import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function ClassCard({ title, time, age, children, classDay }){
  const { t } = useLang()
  return (
    <motion.div whileHover={{ y:-6 }} className="lux-card p-5 sm:p-6 md:p-7 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="text-lg sm:text-xl font-heading leading-tight">{title}</div>
          {(time || age) && (
            <div className="mt-2 text-xs sm:text-sm text-black/70 font-medium">{[time, age].filter(Boolean).join(' • ')}</div>
          )}
        </div>
        <div className="sm:text-right flex-shrink-0">
          <Link
            to={`/registration${classDay ? `?class=${encodeURIComponent(classDay)}&type=active` : ''}`}
            className="inline-block w-full sm:w-auto text-center px-5 sm:px-6 py-3 border-2 border-gold text-gold rounded-lg font-medium tracking-wide transition-all hover:bg-gold hover:text-white hover:shadow-md active:scale-95"
            aria-label={`${t('classes.register')} ${classDay ? `(${classDay})` : ''}`.trim()}
          >
            {t('classes.register')}
          </Link>
        </div>
      </div>
      {children}
    </motion.div>
  )
}
