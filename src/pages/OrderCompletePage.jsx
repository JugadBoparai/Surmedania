import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

export default function OrderCompletePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const order = location.state?.order

  if (!order) {
    return (
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="font-heading text-2xl mb-3">{t('order.noOrder') || 'No order found'}</h2>
          <button
            onClick={() => navigate('/merch')}
            className="px-6 py-3 bg-gradient-to-r from-gold to-[#B8902F] text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            {t('merch.continueShopping') || 'Continue shopping'}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span className="text-5xl">✓</span>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl sm:text-4xl mb-3">
            {t('order.success') || 'Order Successful!'}
          </h1>
          <p className="text-lg text-black/60 mb-2">
            {t('order.successMessage') || 'Thank you for your order'}
          </p>
          <p className="text-sm text-black/50">
            {t('order.confirmation') || 'A confirmation email has been sent to'} {order.customer.email}
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lux-card p-6 sm:p-8 text-left mb-8"
        >
          <div className="mb-6 pb-6 border-b-2 border-black/10">
            <h2 className="font-heading text-xl mb-3">{t('order.details') || 'Order Details'}</h2>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">{t('order.orderNumber') || 'Order Number'}:</span> <span className="text-gold font-bold">{order.orderId}</span></p>
              <p><span className="font-medium">{t('order.date') || 'Date'}:</span> {new Date(order.timestamp).toLocaleDateString()}</p>
              <p><span className="font-medium">{t('order.status') || 'Status'}:</span> <span className="text-green-600 font-semibold">{t('order.confirmed') || 'Confirmed'}</span></p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6 pb-6 border-b-2 border-black/10">
            <h3 className="font-semibold mb-2">{t('order.shippingAddress') || 'Shipping Address'}</h3>
            <div className="text-sm text-black/70">
              <p>{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.postalCode} {order.customer.city}</p>
              <p>{order.customer.country}</p>
              <p className="mt-1">{order.customer.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">{t('order.items') || 'Items'}</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-black/5 to-gold/5 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{item.category === 'clothing' ? '👕' : '☕'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name[lang] || item.name.en}</p>
                      {item.size && <p className="text-xs text-black/60">Size: {item.size}</p>}
                      <p className="text-xs text-black/60">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gold">{item.price * (item.quantity || 1)} NOK</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t-2 border-black/10">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t('merch.total') || 'Total'}:</span>
              <span className="text-gold">{order.total} NOK</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/merch')}
            className="px-8 py-3 bg-gradient-to-r from-gold to-[#B8902F] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            {t('merch.continueShopping') || 'Continue shopping'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold/5 transition-all"
          >
            {t('nav.home') || 'Home'}
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
