import React, { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useLocation, Link } from 'react-router-dom'

export default function About(){
  const { t } = useLang()
  // Lazy-loaded sections to reduce initial bundle size
  const Styles = lazy(() => import('./Styles'))
  const GalleryPage = lazy(() => import('./GalleryPage'))
  const [loaded, setLoaded] = useState(false)
  const location = useLocation()

  // Scroll to anchor when navigating to /about#something
  useEffect(() => {
    if (!location || !location.hash) return
    const id = location.hash.replace('#', '')
    if (!id) return
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [location])
  
  return (
    <>
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
          {t('about.storyTitle')}
        </h1>
        <p className="text-gold font-medium tracking-wide text-xs sm:text-sm">
          {t('about.tagline')}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-black/70 leading-relaxed text-xs sm:text-sm mb-6 sm:mb-8">{t('about.storyIntro')}</p>

          <h3 className="font-heading text-lg sm:text-xl mb-3">{t('about.founderTitle')}</h3>
          <p className="text-black/70 leading-relaxed text-xs sm:text-sm mb-6 sm:mb-8">{t('about.founderBio')}</p>

          <h3 className="font-heading text-lg sm:text-xl mb-3">{t('about.philosophyTitle')}</h3>
          <p className="text-black/70 leading-relaxed text-xs sm:text-sm">{t('about.philosophyText')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lux-card p-4 sm:p-5 order-first md:order-last"
        >
          <figure className="relative">
            <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-black/5">
              {/* skeleton shimmer */}
              {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/5 via-black/10 to-black/5" />
              )}
              <img
                src="/founder.jpeg"
                alt={t('about.founderAlt')}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            <figcaption className="mt-3 text-xs sm:text-sm text-black/60 text-center">{t('about.founderCaption')}</figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
    
    {/* Styles and Gallery sections included on the same /about page (lazy-loaded) */}
    <Suspense fallback={
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="mx-auto max-w-3xl animate-pulse h-40 rounded-lg bg-black/5" />
      </div>
    }>
      <Styles />
    </Suspense>

    <Suspense fallback={
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="mx-auto max-w-4xl animate-pulse h-56 rounded-lg bg-black/5" />
      </div>
    }>
      <GalleryPage />
    </Suspense>

    {/* Ready to dance CTA (moved here so it appears after Styles + Gallery) */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }} 
      className="text-center mt-10 sm:mt-12 container mx-auto px-4 sm:px-6"
    >
      <h2 className="font-heading text-xl sm:text-2xl mb-3">{t('styles.readyToDance')}</h2>
      <p className="text-xs sm:text-sm text-black/70 max-w-xl mx-auto mb-6">{t('styles.ctaSubtitle')}</p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Link to="/registration" className="inline-block px-6 py-3 rounded-lg bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">{t('styles.registerNow')}</Link>
        <Link to="/classes" className="inline-block px-6 py-3 rounded-lg border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-white transition-all text-sm">{t('styles.viewSchedule')}</Link>
      </div>
    </motion.div>
    </>
  )
}
