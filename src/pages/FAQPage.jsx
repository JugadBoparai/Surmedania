import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/Breadcrumb'
import SEO from '../components/SEO'
import FAQAccordion from '../components/FAQAccordion'
import { useLang } from '../context/LanguageContext'

export default function FAQPage(){
  const { t, lang } = useLang()

  // Helper function to add links to answers
  const addLinks = (text, linkMap) => {
    let result = text
    Object.entries(linkMap).forEach(([keyword, url]) => {
      const link = `<a href="${url}" class="text-gold hover:underline font-medium">${keyword}</a>`
      result = result.replace(keyword, link)
    })
    return <span dangerouslySetInnerHTML={{ __html: result }} />
  }

  const generalItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { 
      q: t('faq.q3'), 
      a: addLinks(t('faq.a3'), {
        [lang === 'no' ? 'Klasser-siden' : lang === 'pa' ? 'ਕਲਾਸਾਂ ਪੰਨਾ' : 'Classes page']: '/classes'
      })
    }
  ]

  const membershipItems = [
    { 
      q: t('faq.q4'), 
      a: addLinks(t('faq.a4'), {
        [lang === 'no' ? 'Registrering' : lang === 'pa' ? 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ' : 'Registration']: '/registration'
      })
    },
    { 
      q: t('faq.q5'), 
      a: addLinks(t('faq.a5'), {
        [lang === 'no' ? 'Registrering' : lang === 'pa' ? 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ' : 'Registration']: '/registration'
      })
    },
    { q: t('faq.q6'), a: t('faq.a6') }
  ]

  const practicalItems = [
    { q: t('faq.q7'), a: t('faq.a7') },
    { 
      q: t('faq.q8'), 
      a: addLinks(t('faq.a8'), {
        'Marikollen Kultursal': 'https://www.google.com/maps/place/Marikollen+Kultursal/@59.9321,11.0879,17z',
        [lang === 'no' ? 'Klasser-siden' : lang === 'pa' ? 'ਕਲਾਸਾਂ ਪੰਨਾ' : 'Classes page']: '/classes'
      })
    },
    { q: t('faq.qWear'), a: t('faq.aWear') },
    { 
      q: t('faq.qPerform'), 
      a: addLinks(t('faq.aPerform'), {
        [lang === 'no' ? 'Nyheter og hendelser' : lang === 'pa' ? 'ਖ਼ਬਰਾਂ ਅਤੇ ਸਮਾਗਮ' : 'News & Events']: '/news'
      })
    },
    { q: t('faq.qBook'), a: t('faq.aBook') }
  ]

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <SEO 
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about Surmedania Dance School including class schedules, membership, what to wear, locations, and more. Get all the info you need to get started."
        keywords="dance class faq, surmedania questions, bhangra class info, dance school help"
        canonicalPath="/faq"
      />
      <Breadcrumb items={[{ label: t('nav.faq') || 'FAQ', path: '/faq' }]} />
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
          {t('faq.h1Title')}
        </h1>
        <p className="text-gold font-medium tracking-wide text-xs sm:text-sm">
          {t('faq.h1Intro')}
        </p>
      </motion.div>

      {/* General Questions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 sm:mb-10"
      >
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
          {t('faq.sectionGeneral')}
        </h2>
        <FAQAccordion items={generalItems} />
      </motion.div>

      {/* Membership Questions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 sm:mb-10"
      >
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
          {t('faq.sectionMembership')}
        </h2>
        <FAQAccordion items={membershipItems} />
      </motion.div>

      {/* Practical Questions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8 sm:mb-10"
      >
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
          {t('faq.sectionPractical')}
        </h2>
        <FAQAccordion items={practicalItems} />
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-10 sm:mt-12"
      >
        <h3 className="font-heading text-xl sm:text-2xl mb-3">
          {t('faq.ctaTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-black/70 mb-6 max-w-xl mx-auto">
          {t('faq.ctaText')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/feedback"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
            {t('faq.ctaContact')}
          </Link>
          <Link
            to="/registration"
            className="inline-block px-6 py-3 rounded-lg border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-white transition-all text-sm"
          >
            {t('faq.ctaRegister')}
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

