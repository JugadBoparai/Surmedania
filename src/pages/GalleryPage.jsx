import React from 'react'
import { useLang } from '../context/LanguageContext'
import { motion } from 'framer-motion'

const images = [
  '/hero.jpg',
  '/giddha.jpg',
  '/giddha1.jpg',
  '/giddha2.jpg',
  '/idk.jpg',
  '/founder.jpeg',
  '/dance1.jpg',
  '/dance2.jpg',
  '/dance3.jpg',
  '/dance4.jpg',
  '/dance5.jpg',
  '/dance6.jpg',
  '/dance7.jpg',
  '/dance8.jpg'
]

export default function GalleryPage(){
  const { t } = useLang()
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
          {t('common.gallery')}
        </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {images.map((src, idx) => (
          <motion.div 
            whileHover={{ scale:1.03 }} 
            key={idx} 
            className="overflow-hidden rounded-lg border-2 border-white/30 shadow-md hover:shadow-lg hover:border-gold/20 transition-all"
          >
            <img src={src} alt={`Gallery image ${idx+1}`} className="w-full h-40 sm:h-48 object-cover" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
