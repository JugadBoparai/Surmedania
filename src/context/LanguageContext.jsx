import React, { createContext, useContext, useState, useEffect } from 'react'
import translations from '../i18n/translations.json'

const LanguageContext = createContext()

// Dev-only: track keys we've warned about to avoid spam and expose them for a debug panel
const __missingWarned = new Set()
const __missingKeys = [] // {lang, path, type:'fallback'|'missing'}

export function useLang(){
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }){
  // Supported languages and defaults
  const SUPPORTED = ['no', 'en', 'pa']
  const DEFAULT_LANG = 'no'

  const mapToSupported = (code) => {
    if (!code || typeof code !== 'string') return undefined
    const lc = code.toLowerCase()
    if (lc.startsWith('en')) return 'en'
    if (lc.startsWith('no') || lc.startsWith('nb') || lc.startsWith('nn')) return 'no'
    if (lc.startsWith('pa')) return 'pa'
    return undefined
  }

  const detectBrowserLang = () => {
    const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean)
    for (const l of list){
      const m = mapToSupported(l)
      if (m) return m
    }
    return undefined
  }

  const getInitialLang = () => {
    // 1) URL query ?lang=
    try {
      const sp = new URLSearchParams(window.location.search)
      const fromUrl = mapToSupported(sp.get('lang'))
      if (fromUrl && SUPPORTED.includes(fromUrl)) return fromUrl
    } catch {}
    // 2) localStorage
    const saved = mapToSupported(localStorage.getItem('surmedania-lang'))
    if (saved && SUPPORTED.includes(saved)) return saved
    // 3) browser
    const browser = detectBrowserLang()
    if (browser && SUPPORTED.includes(browser)) return browser
    // 4) fallback
    return DEFAULT_LANG
  }

  // Load language from URL/localStorage/navigator or default
  const [lang, setLangState] = useState(getInitialLang)

  // Save language to localStorage whenever it changes
  const setLang = (newLang) => {
    const normalized = mapToSupported(newLang) || DEFAULT_LANG
    if (normalized === lang) return
    setLangState(normalized)
    localStorage.setItem('surmedania-lang', normalized)
    // Update URL ?lang= without adding history entries
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', normalized)
      window.history.replaceState(null, '', url.toString())
    } catch {}
  }

  // Keep <html lang="…"> in sync for accessibility/SEO
  useEffect(() => {
    try {
      document.documentElement.setAttribute('lang', lang)
      document.documentElement.setAttribute('dir', 'ltr') // all current langs are LTR
    } catch {}
  }, [lang])

  // Cross-tab sync via storage events
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'surmedania-lang' && e.newValue) {
        const incoming = mapToSupported(e.newValue)
        if (incoming && incoming !== lang) {
          setLangState(incoming)
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [lang])

  const t = (path, fallback = '') => {
    const parts = path.split('.')

    // Try current language
    let cur = translations[lang]
    for (const p of parts) {
      if (!cur) break
      cur = cur[p]
    }
    if (cur !== undefined && cur !== null) return cur

    // Fallback to English
    cur = translations['en']
    for (const p of parts) {
      if (!cur) break
      cur = cur[p]
    }
    if (cur !== undefined && cur !== null) {
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        const key = `${lang}:${path}`
        if (!__missingWarned.has(key)) {
          __missingWarned.add(key)
          console.warn(`[i18n] Missing key for lang "${lang}": "${path}" — falling back to en`)
          __missingKeys.push({ lang, path, type: 'fallback', timestamp: Date.now() })
        }
      }
      return cur
    }

    // Final fallback
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      const key = `missing:${path}`
      if (!__missingWarned.has(key)) {
        __missingWarned.add(key)
        console.warn(`[i18n] Missing key in all languages: "${path}"`)
        __missingKeys.push({ lang: 'all', path, type: 'missing', timestamp: Date.now() })
      }
    }
    return fallback ?? ''
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: SUPPORTED, cycleLang: () => {
      const idx = SUPPORTED.indexOf(lang)
      const next = SUPPORTED[(idx + 1) % SUPPORTED.length]
      setLang(next)
    }, _missing: __missingKeys }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
