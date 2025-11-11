import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function RegistrationConfirm(){
  const { t } = useLang()
  const loc = useLocation()
  const state = loc.state || {}
  const memberType = state.memberType || 'active'
  
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const SPOND_LINK = 'https://spond.com/invite/EUKYZ'
  const VIPPS_NUMBER = '943635'
  
  const handlePayment = async () => {
    let amountToPay = ''
    
    if (memberType === 'active') {
      if (!selectedAmount) {
        setError(t('confirm.selectPaymentError') || 'Please select a payment option')
        return
      }
      amountToPay = selectedAmount
    } else {
      // Supported member
      const amount = parseInt(customAmount)
      if (!customAmount || isNaN(amount) || amount < 50) {
        setError(t('confirm.minimumError') || 'Minimum payment is 50 NOK')
        return
      }
      amountToPay = customAmount
    }
    
    setError('')
    setLoading(true)
    
    // Generate unique order ID
    const orderId = `SUR${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    
    try {
      // Call Vipps API to initiate payment
      const response = await fetch('/api/vipps-initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPay,
          memberType,
          name: state.name || '',
          phone: state.phone || '',
          email: state.email || '',
          orderId
        })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate payment')
      }
      
      // Redirect to Vipps payment page
      window.location.href = data.url
      
    } catch (err) {
      console.error('Payment error:', err)
      setLoading(false)
      setError(t('payment.error') || 'Failed to start payment. Please try again or use manual Vipps payment below.')
      // Show manual payment instructions as fallback
      const el = document.getElementById('payment-instructions')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="lux-card p-6 sm:p-8 text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl mb-3">{t('confirm.title')}</h2>
        <p className="mt-4 text-black/70 mb-8 text-sm sm:text-base leading-relaxed">{t('confirm.message')}</p>
        
        {/* Payment Selection */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg sm:text-xl mb-5">{t('confirm.selectPayment') || 'Select Payment'}</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          
          {memberType === 'active' ? (
            // Active Members: Select 199, 349 or 449
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setSelectedAmount('199')}
                className={`p-6 border-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
                  selectedAmount === '199' 
                    ? 'border-gold bg-gold text-white' 
                    : 'border-gold hover:bg-gold/10'
                }`}
              >
                <div className="text-lg font-semibold mb-2">3 {t('confirm.months')}</div>
                <div className="text-3xl font-bold mb-1">199 NOK</div>
                <div className="text-sm opacity-80">{t('confirm.perMonth')}: 66 NOK</div>
              </button>

              <button
                onClick={() => setSelectedAmount('349')}
                className={`p-6 border-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
                  selectedAmount === '349' 
                    ? 'border-gold bg-gold text-white' 
                    : 'border-gold hover:bg-gold/10'
                }`}
              >
                <div className="text-lg font-semibold mb-2">6 {t('confirm.months')}</div>
                <div className="text-3xl font-bold mb-1">349 NOK</div>
                <div className="text-sm opacity-80">{t('confirm.perMonth')}: 58 NOK</div>
              </button>
              
              <button
                onClick={() => setSelectedAmount('449')}
                className={`p-6 border-2 rounded-lg transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
                  selectedAmount === '449' 
                    ? 'border-gold bg-gold text-white' 
                    : 'border-gold hover:bg-gold/10'
                }`}
              >
                <div className="absolute -top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded">
                  {t('confirm.bestValue')}
                </div>
                <div className="text-lg font-semibold mb-2">12 {t('confirm.months')}</div>
                <div className="text-3xl font-bold mb-1">449 NOK</div>
                <div className="text-sm opacity-80">{t('confirm.perMonth')}: 37 NOK</div>
              </button>
            </div>
          ) : (
            // Supported Members: Custom amount (min 50)
            <div className="mb-8 p-6 border-2 border-gold rounded-lg">
              <label className="block text-sm font-semibold mb-2">
                {t('confirm.customAmount') || 'Enter Amount'} ({t('registration.minimum')} 50 NOK)
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="50"
                placeholder="50"
                className="w-full p-3 border rounded text-center text-2xl font-bold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
              />
              <p className="text-xs text-black/60 mt-2">
                {t('registration.supportedHelper') || 'Enter any amount 50 NOK or more'}
              </p>
            </div>
          )}
          
          <button
            onClick={handlePayment}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (t('payment.processing') || 'Processing...') : (t('confirm.continueToPayment') || 'Continue to Payment')}
          </button>
        </div>

        {/* Payment Instructions (shown after clicking Continue) */}
  <div id="payment-instructions" className={`${error ? 'block' : 'hidden'} mb-10 p-6 sm:p-7 bg-gold/10 rounded-lg border border-gold/20`}>
          <h3 className="font-semibold text-base sm:text-lg mb-4">{t('confirm.payVipps')}</h3>
          <p className="text-sm text-black/70 mb-3">{t('confirm.vippsInstruction')}</p>
          <div className="text-5xl font-bold text-gold mb-3 tracking-tight">{VIPPS_NUMBER}</div>
          <div className="text-2xl sm:text-3xl font-bold text-black mb-3">
            {memberType === 'active' ? selectedAmount : customAmount} NOK
          </div>
          <p className="text-sm text-black/60">{t('confirm.vippsMessage')}</p>
        </div>

        {/* Other Actions */}
  <div className="flex flex-col md:flex-row justify-center gap-4 pt-8 border-t border-black/10">
          {memberType === 'active' && (
            <a className="px-6 py-3 bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white rounded-lg font-semibold hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40" href={SPOND_LINK} target="_blank" rel="noreferrer">{t('confirm.openSpond')}</a>
          )}
          <Link to="/" className="px-6 py-3 border-2 border-gold text-gold rounded-lg font-semibold hover:bg-gold hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40">{t('confirm.returnHome')}</Link>
        </div>
      </div>
    </section>
  )
}
