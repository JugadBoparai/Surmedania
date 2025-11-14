import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function Breadcrumb({ items }) {
  const { t } = useLang()

  return (
    <nav aria-label="Breadcrumb" className="sr-only">
      <ol className="flex items-center gap-2 text-sm text-black/60">
        <li>
          <Link 
            to="/" 
            className="hover:text-gold transition-colors inline-flex items-center gap-1.5"
            aria-label={t('nav.a11y.home') || 'Go to home page'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{t('nav.home') || 'Home'}</span>
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {isLast ? (
                <span className="text-black/40 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  className="hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
