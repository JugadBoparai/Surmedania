import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function NotFound(){
  const { t } = useLang()
  return (
    <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
      <div className="lux-card max-w-xl mx-auto p-6 sm:p-8">
        <h2 className="font-heading text-2xl sm:text-3xl mb-4 tracking-tight">{t('notFound.title')}</h2>
        <p className="mt-2 text-black/70 text-sm sm:text-base leading-relaxed">{t('notFound.message')}</p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-8 py-3 border-2 border-gold text-gold rounded-lg font-semibold hover:bg-gold hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          >
            {t('confirm.returnHome')}
          </Link>
        </div>
      </div>
    </section>
  )
}
