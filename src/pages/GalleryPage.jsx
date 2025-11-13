import React, { useState, useRef, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

const images = [
  '/hero.jpg',
  '/bhangra.jpg',
  '/giddha.jpg',
  '/giddha1.jpg',
  '/giddha2.jpg',
  '/giddha3.jpg',
  '/giddha4.jpg',
  '/trening.jpg'
]

export default function GalleryPage(){
  const { t } = useLang()
  const [selectedImage, setSelectedImage] = useState(null)
  const [loadedImages, setLoadedImages] = useState({})
  const closeBtnRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const modalRef = useRef(null)

  const handleImageLoad = (idx) => {
    setLoadedImages(prev => ({ ...prev, [idx]: true }))
  }

  // Keyboard handlers & focus management for lightbox
  useEffect(() => {
    if (selectedImage === null) return

    // save last focused element
    lastFocusedRef.current = document.activeElement

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
      } else if (e.key === 'ArrowLeft') {
        setSelectedImage((s) => (s > 0 ? s - 1 : s))
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((s) => (s < images.length - 1 ? s + 1 : s))
      } else if (e.key === 'Tab') {
        // basic focus trap inside modal
        const container = modalRef.current
        if (!container) return
        const focusable = Array.from(container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'))
        if (focusable.length === 0) return
        const current = document.activeElement
        const idx = focusable.indexOf(current)
        if (e.shiftKey) {
          // move focus backwards
          const prev = focusable[(idx - 1 + focusable.length) % focusable.length]
          e.preventDefault()
          prev.focus()
        } else {
          const next = focusable[(idx + 1) % focusable.length]
          e.preventDefault()
          next.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)

    // focus close button when modal opens
    setTimeout(() => {
      try { closeBtnRef.current?.focus() } catch (e) {}
    }, 0)

    return () => {
      document.removeEventListener('keydown', onKey)
      // restore focus
      try { lastFocusedRef.current?.focus() } catch (e) {}
    }
  }, [selectedImage])

  return (
    <>
      <section id="gallery" className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-gold/5 via-gold/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-gold/5 via-gold/10 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
            {t('common.gallery')}
          </h1>
          <p className="text-gold font-medium tracking-wide text-sm sm:text-base">
            Celebrating the art of Punjabi dance
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </motion.div>

        {/* Masonry Grid Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="break-inside-avoid"
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`Open image ${idx + 1} of ${images.length}`}
                onClick={() => setSelectedImage(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedImage(idx)
                  }
                }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer bg-gradient-to-br from-gold/5 to-transparent"
              >
                {/* Loading skeleton */}
                {!loadedImages[idx] && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/5 via-black/10 to-black/5" />
                )}
                
                {/* Image */}
                <img 
                  src={src} 
                  alt={`Gallery ${idx+1}`} 
                  loading="lazy"
                  decoding="async"
                  onLoad={() => handleImageLoad(idx)}
                  className={`w-full h-auto object-cover transition-all duration-500 ${loadedImages[idx] ? 'opacity-100' : 'opacity-0'}`}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">View full size</span>
                    </div>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => setSelectedImage(null)}
              ref={closeBtnRef}
              aria-label="Close gallery (Esc)"
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="Image viewer"
              className="relative w-full h-full max-w-[90vw] max-h-[90vh] cursor-default flex items-center justify-center"
            >
              <img
                src={images[selectedImage]}
                alt={`Gallery ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
              
              {/* Navigation arrows */}
              {selectedImage > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(selectedImage - 1)
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {selectedImage < images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(selectedImage + 1)
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium" aria-live="polite">
                {selectedImage + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
