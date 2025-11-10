import React, { useRef, useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

// Accessible, keyboard-friendly language switcher
// - Elegant dropdown with flags (UK, Norway, India)
// - Gold highlight for active language, smooth hover effects
// - Auto-closes on select or outside click
// - Responsive design
export default function LanguageSwitcher({ className = '', variant = 'dropdown' }){
  const { lang, setLang, t, languages = ['no','en','pa'] } = useLang()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languageData = {
    en: { label: 'English', flag: '🇬🇧', aria: t('nav.a11y.switchToEn') },
    no: { label: 'Norsk', flag: '🇳🇴', aria: t('nav.a11y.switchToNo') },
    pa: { label: 'ਪੰਜਾਬੀ', flag: '🇮🇳', aria: t('nav.a11y.switchToPa') },
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  const handleSelect = (code) => {
    setLang(code)
    setOpen(false)
  }

  const currentLang = languageData[lang] || languageData.en

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown trigger button - compact, flag only */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={t('nav.a11y.chooseLanguage')}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center justify-center rounded-lg border border-black/10 bg-white/90 backdrop-blur-sm w-9 h-9 shadow-sm transition-all hover:shadow-md hover:border-[#C9A74A]/30 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A74A]/40 focus-visible:ring-offset-1"
      >
        <span className="text-lg leading-none">{currentLang.flag}</span>
      </button>

      {/* Dropdown menu - compact with names */}
      {open && (
        <div
          role="listbox"
          aria-label={t('nav.a11y.chooseLanguage')}
          className="absolute right-0 mt-1 w-36 rounded-lg border border-black/10 bg-white shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {languages.map((code) => {
            const langInfo = languageData[code]
            const isSelected = lang === code
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-label={langInfo.aria}
                onClick={() => handleSelect(code)}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all',
                  isSelected
                    ? 'bg-gradient-to-r from-[#C9A74A]/10 to-[#B8902F]/5 text-[#B8902F] font-semibold'
                    : 'text-black/70 hover:bg-black/5 hover:text-black/90',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C9A74A]/40',
                ].join(' ')}
              >
                <span className="text-xl leading-none">{langInfo.flag}</span>
                <span className="text-sm flex-1">{langInfo.label}</span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-[#C9A74A]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
