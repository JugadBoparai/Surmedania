import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/Breadcrumb'
import SEO from '../components/SEO'
import { useLang } from '../context/LanguageContext'

const API_BASE = import.meta.env.VITE_WEBHOOK_URL?.replace(/\/webhook$/, '') || '/api'

export default function FeedbackPage() {
  const { t, lang } = useLang()
  const [anonymous, setAnonymous] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', feedback: '' })
  const [status, setStatus] = useState(null)

  function update(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setStatus(null)
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          feedback: form.feedback.trim(),
          anonymous
        })
      })
      if(!res.ok) {
        const data = await res.json().catch(()=>null)
        throw new Error(data?.error || 'Failed to send feedback')
      }
      setStatus(t('feedback.success') || 'Thank you for your feedback!')
      setForm({ name: '', email: '', feedback: '' })
      setAnonymous(false)
    } catch(err) {
      setStatus(err.message)
    }
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <SEO 
        title="Contact Us"
        description="Get in touch with Surmedania Dance School. Share your feedback, ask questions, or reach out for more information. We'd love to hear from you!"
        keywords="contact surmedania, dance school contact, feedback, get in touch, surmedania email"
        canonicalPath="/feedback"
      />
      <Breadcrumb items={[{ label: t('nav.contact') || 'Contact', path: '/feedback' }]} />
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent leading-tight pb-1">
          {lang === 'no' ? 'Kontakt Oss' : lang === 'pa' ? 'ਸੰਪਰਕ' : 'Contact'}
        </h1>
        <p className="text-gold font-medium tracking-wide text-xs sm:text-sm">
          {t('feedback.subtitle')}
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div className="lux-card p-6 sm:p-8 md:p-10 bg-gradient-to-b from-white/80 to-white/60">
          <form onSubmit={submit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gold/5 border border-gold/10">
              <input 
                type="checkbox" 
                id="anonymous-toggle"
                className="mt-1 h-4 w-4 rounded border-gold/30 text-gold focus:ring-2 focus:ring-gold/20 focus:ring-offset-0 cursor-pointer transition" 
                checked={anonymous} 
                onChange={e => setAnonymous(e.target.checked)} 
              />
              <label htmlFor="anonymous-toggle" className="flex-1 cursor-pointer">
                <span className="block text-sm sm:text-base font-medium text-black/90 mb-1">
                  {t('feedback.anonymous') || 'Send anonymously'}
                </span>
                <span className="text-xs sm:text-sm text-black/60">
                  {t('feedback.anonymousDesc') || 'Your identity will remain private'}
                </span>
              </label>
            </div>

            {/* Contact Fields (shown when not anonymous) */}
            {!anonymous && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label htmlFor="name" className="block text-sm sm:text-base font-medium text-black/90 mb-2.5">
                    {t('registration.name') || 'Name'}<span className="text-gold ml-1">*</span>
                  </label>
                  <input 
                    id="name"
                    name="name" 
                    value={form.name} 
                    onChange={update} 
                    className="w-full px-4 py-3.5 border-2 border-black/10 rounded-xl bg-white/50 focus:bg-white focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all placeholder:text-black/30" 
                    placeholder={t('feedback.namePlaceholder')}
                    required={!anonymous}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-medium text-black/90 mb-2.5">
                    {t('registration.email') || 'Email'}<span className="text-gold ml-1">*</span>
                  </label>
                  <input 
                    id="email"
                    type="email"
                    name="email" 
                    value={form.email} 
                    onChange={update} 
                    className="w-full px-4 py-3.5 border-2 border-black/10 rounded-xl bg-white/50 focus:bg-white focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all placeholder:text-black/30" 
                    placeholder={t('feedback.emailPlaceholder')}
                    required={!anonymous}
                  />
                </div>
              </div>
            )}

            {/* Feedback Textarea */}
            <div>
              <label htmlFor="feedback" className="block text-sm sm:text-base font-medium text-black/90 mb-2.5">
                {t('feedback.feedbackLabel') || 'Your Feedback'}<span className="text-gold ml-1">*</span>
              </label>
              <textarea 
                id="feedback"
                name="feedback" 
                value={form.feedback} 
                onChange={update} 
                rows="6" 
                className="w-full px-4 py-3.5 border-2 border-black/10 rounded-xl bg-white/50 focus:bg-white focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all resize-y min-h-[140px] placeholder:text-black/30" 
                placeholder={t('feedback.placeholder') || 'Share your thoughts, suggestions, or experiences with us...'}
                required 
              />
              <p className="mt-2 text-xs sm:text-sm text-black/50">
                {t('feedback.hint') || 'Be as detailed as you like. We appreciate all feedback!'}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button 
                type="submit" 
                className="w-full sm:flex-1 px-8 py-4 bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gold/30 transition-all duration-200 active:scale-[0.98]"
              >
                {t('feedback.submit') || 'Submit Feedback'}
              </button>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`p-4 rounded-xl border-2 text-sm sm:text-base font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                status.toLowerCase().includes('fail') || status.toLowerCase().includes('error')
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') ? '⚠️' : '✓'}
                  </span>
                  <span className="flex-1">{status}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-black/60">
            {t('feedback.privacy') || 'Your feedback is confidential and helps us improve our services.'}
          </p>
        </div>
      </motion.div>
    </section>
  )
}
