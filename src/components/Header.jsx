import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import logoUrl from '../assets/logo.svg'
import { useLang } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import LanguageSwitcher from './LanguageSwitcher'
import { motion, AnimatePresence } from 'framer-motion'

// LanguageSwitcher replaces the old flag-based LangToggle for better accessibility

export default function Header(){
  const { t } = useLang()
  const { toggleCart, getCartCount } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const drawerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll when mobile menu is open and set initial focus in drawer
  useEffect(() => {
    if (open) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // focus first focusable in drawer
      setTimeout(() => {
        const el = drawerRef.current
        if (!el) return
        const focusables = el.querySelectorAll(
          'a, button, select, textarea, input, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length > 0) {
          focusables[0].focus()
        }
      }, 0)
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [open])

  const navClass = ({ isActive }) => [
    'relative text-sm tracking-wide transition-colors',
    isActive ? 'text-deepblack' : 'text-deepblack/70 hover:text-deepblack',
    'after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-gold after:transition-all',
    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
  ].join(' ')

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${scrolled ? 'border-black/5 bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur-sm shadow-sm' : 'border-white/40 bg-gradient-to-r from-offwhite to-white/90'}`}>
      <div className="container mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label={t('nav.a11y.home')}>
          <img src={logoUrl} alt={t('common.logoAlt')} className="w-28 h-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
       <NavLink to="/about" className={navClass}>{t('nav.about')}</NavLink>
       <NavLink to="/classes" className={navClass}>{t('nav.classes')}</NavLink>
       <NavLink to="/news" className={navClass}>{t('nav.news')}</NavLink>
       <NavLink to="/merch" className={navClass}>{t('nav.merch', 'Merch')}</NavLink>
       <NavLink to="/faq" className={navClass}>{t('nav.faq')}</NavLink>
       <NavLink to="/feedback" className={navClass}>{t('nav.contact')}</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {/* Shopping Cart Button */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={t('cart.openCart', 'Open shopping cart')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-gold to-[#B8902F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>

          <Link
            to="/registration"
            className="hidden sm:inline-block rounded-full bg-gradient-to-br from-[#C9A74A] to-[#B8902F] px-4 py-2 text-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C9A74A]/40"
          >
            {t('nav.registration')}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-3 rounded border"
            aria-label={t('nav.a11y.openMenu')}
            aria-expanded={open}
            aria-controls="mobile-menu-drawer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <LanguageSwitcher />
        </div>

        {createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                exit={{ opacity:0 }}
                className="fixed inset-0 z-[100] bg-black/40"
                aria-hidden={!open}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  id="mobile-menu-drawer"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-menu-title"
                  ref={drawerRef}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setOpen(false)
                    if (e.key === 'Tab') {
                      const el = drawerRef.current
                      if (!el) return
                      const focusables = Array.from(el.querySelectorAll(
                        'a, button, select, textarea, input, [tabindex]:not([tabindex="-1"])'
                      )).filter((n) => n instanceof HTMLElement && !n.hasAttribute('disabled') && n.getAttribute('aria-hidden') !== 'true')
                      if (focusables.length === 0) return
                      const first = focusables[0]
                      const last = focusables[focusables.length - 1]
                      if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault(); (first instanceof HTMLElement) && first.focus()
                      } else if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault(); (last instanceof HTMLElement) && last.focus()
                      }
                    }
                  }}
                  initial={{ x: '100%' }}
                  animate={{ x:0 }}
                  exit={{ x: '100%' }}
                  transition={{ type:'spring', stiffness: 260, damping: 26 }}
                  className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-offwhite p-6 shadow-xl rounded-l-2xl pb-[env(safe-area-inset-bottom)] overflow-y-auto overscroll-contain z-[101]"
                >
                  <div className="flex items-center justify-between">
                    <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 group" aria-label={t('nav.a11y.home')}>
                      <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">S</div>
                      <div id="mobile-menu-title">
                        <div className="font-heading group-hover:text-gold transition-colors">Surmedania</div>
                        <div className="text-xs text-black/60">{t('common.brandTagline')}</div>
                      </div>
                    </Link>
                    <button onClick={() => setOpen(false)} className="p-3 rounded" aria-label={t('nav.a11y.closeMenu')}>
                      ✕
                    </button>
                  </div>

                  <nav className="mt-8 flex flex-col gap-3 text-lg">
                    <NavLink onClick={() => setOpen(false)} to="/" className={navClass}>{t('nav.home')}</NavLink>
                    <NavLink onClick={() => setOpen(false)} to="/about" className={navClass}>{t('nav.about')}</NavLink>
                    <NavLink onClick={() => setOpen(false)} to="/classes" className={navClass}>{t('nav.classes')}</NavLink>
                    <NavLink onClick={() => setOpen(false)} to="/news" className={navClass}>{t('nav.news')}</NavLink>
                    <NavLink onClick={() => setOpen(false)} to="/merch" className={navClass}>{t('nav.merch', 'Merch')}</NavLink>
                    <NavLink onClick={() => setOpen(false)} to="/faq" className={navClass}>{t('nav.faq')}</NavLink>
                    <NavLink onClick={() => setOpen(false)} to="/feedback" className={navClass}>{t('nav.contact')}</NavLink>
                    <Link
                      to="/registration"
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-block rounded-full bg-gradient-to-br from-[#C9A74A] to-[#B8902F] px-4 py-2 text-white shadow-sm"
                    >
                      {t('nav.registration')}
                    </Link>
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </header>
  )
}
