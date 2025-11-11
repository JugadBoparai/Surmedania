import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function PaymentComplete() {
  const { t } = useLang()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="lux-card p-6 sm:p-8 text-center max-w-2xl mx-auto">
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="font-heading text-2xl sm:text-3xl mb-3 text-green-600">
          {t('payment.success') || 'Payment Successful!'}
        </h2>
        
        <p className="text-black/70 mb-6 text-sm sm:text-base leading-relaxed">
          {t('payment.thankYou') || 'Thank you for your payment. Your registration is now complete.'}
        </p>

        {orderId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-black/60">
              {t('payment.orderId') || 'Order ID'}: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <a 
            href="https://spond.com/invite/EUKYZ" 
            target="_blank" 
            rel="noreferrer"
            className="px-6 py-3 bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            {t('confirm.openSpond') || 'Open Spond Group'}
          </a>
          <Link 
            to="/" 
            className="px-6 py-3 border-2 border-gold text-gold rounded-lg font-semibold hover:bg-gold hover:text-white transition-all"
          >
            {t('confirm.returnHome') || 'Return Home'}
          </Link>
        </div>
      </div>
    </section>
  )
}
