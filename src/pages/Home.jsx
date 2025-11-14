import React from 'react'
import Hero from '../components/Hero'
import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { motion } from 'framer-motion'

export default function Home(){
  const { t, lang } = useLang()
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  }
  
  return (
    <div>
      <SEO 
        title="Home"
        description="Join Surmedania Dance School for authentic Bhangra and Punjabi folk dance classes in Rælingen. Open to all ages and skill levels. Experience the joy of dance and cultural celebration."
        keywords="bhangra dance, punjabi dance, dance school rælingen, surmedania, dance classes norway, cultural dance, indian dance norway"
        canonicalPath="/"
      />
      <Hero />

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-b from-gold/5 to-transparent py-16 sm:py-24 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl mb-4 tracking-tight">
              {t('home.whyChoose.title')}
            </h2>
            <p className="text-black/60 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              {t('home.whyChoose.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center group cursor-default"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg sm:text-xl mb-3">
                {t('home.whyChoose.allLevels.title')}
              </h3>
              <p className="text-black/70 text-xs sm:text-sm leading-relaxed">
                {t('home.whyChoose.allLevels.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center group cursor-default"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg sm:text-xl mb-3">
                {t('home.whyChoose.culturalPride.title')}
              </h3>
              <p className="text-black/70 text-xs sm:text-sm leading-relaxed">
                {t('home.whyChoose.culturalPride.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center group cursor-default"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg sm:text-xl mb-3">
                {t('home.whyChoose.funEnergy.title')}
              </h3>
              <p className="text-black/70 text-xs sm:text-sm leading-relaxed">
                {t('home.whyChoose.funEnergy.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          <div className="text-center">
            <div className="font-heading text-3xl sm:text-4xl md:text-5xl bg-gradient-to-br from-gold to-gold/70 bg-clip-text text-transparent mb-2">
              1+
            </div>
            <p className="text-xs sm:text-sm text-black/60">
              {t('home.stats.yearsExperience')}
            </p>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl sm:text-4xl md:text-5xl bg-gradient-to-br from-gold to-gold/70 bg-clip-text text-transparent mb-2">
              65+
            </div>
            <p className="text-xs sm:text-sm text-black/60">
              {t('home.stats.activeMembers')}
            </p>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl sm:text-4xl md:text-5xl bg-gradient-to-br from-gold to-gold/70 bg-clip-text text-transparent mb-2">
              1000+
            </div>
            <p className="text-xs sm:text-sm text-black/60">
              {t('home.stats.smilesShared')}
            </p>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl sm:text-4xl md:text-5xl bg-gradient-to-br from-gold to-gold/70 bg-clip-text text-transparent mb-2">
              ∞
            </div>
            <p className="text-xs sm:text-sm text-black/60">
              {t('home.stats.memoriesCreated')}
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lux-card p-8 sm:p-12 text-center bg-gradient-to-br from-gold/10 via-white/60 to-gold/5 relative overflow-hidden"
        >
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl mb-4 tracking-tight">
              {t('home.cta.title')}
            </h2>
            <p className="text-black/70 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/registration"
                className="px-8 py-3.5 rounded-lg bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t('home.cta.registerNow')}
              </Link>
              <Link
                to="/classes"
                className="px-8 py-3.5 rounded-lg border-2 border-gold text-gold text-sm font-semibold hover:bg-gold hover:text-white hover:scale-105 transition-all duration-300"
              >
                {t('home.cta.viewClasses')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
// hot reload sanity
// hot reload sanity 2
