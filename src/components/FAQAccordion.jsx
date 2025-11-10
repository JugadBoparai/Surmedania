import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQAccordion({ items }){
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3" role="list">
      {items.map((it, idx) => {
        const isOpen = open === idx
        const id = `faq-${idx}`
        return (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`lux-card overflow-hidden transition-all ${isOpen ? 'shadow-lg' : ''}`}
            role="listitem"
          >
            <button 
              aria-expanded={isOpen} 
              aria-controls={`${id}-panel`} 
              id={`${id}-btn`} 
              className="w-full text-left flex justify-between items-start gap-4 p-4 sm:p-5" 
              onClick={() => setOpen(isOpen?null:idx)}
            >
              <div className="font-medium text-sm sm:text-base text-black/90 flex-1">{it.q}</div>
              <div 
                className={`flex-shrink-0 text-sm text-black/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  id={`${id}-panel`} 
                  role="region" 
                  aria-labelledby={`${id}-btn`} 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="text-xs sm:text-sm text-black/70 leading-relaxed">
                      {it.a}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
