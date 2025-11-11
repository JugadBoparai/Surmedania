import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLang } from '../context/LanguageContext'

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Norway'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate form
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.postalCode) {
      setError(t('checkout.fillRequired') || 'Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      // In a real app, you would integrate with a payment processor like Vipps or Stripe
      // For now, we'll simulate a successful order
      
      const orderData = {
        items: cart,
        total: getCartTotal(),
        customer: form,
        orderId: `ORD${Date.now()}`,
        timestamp: new Date().toISOString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart and redirect to success page
      clearCart()
      navigate('/merch/order-complete', { state: { order: orderData } })
      
    } catch (err) {
      console.error('Checkout error:', err)
      setError(t('checkout.error') || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="font-heading text-2xl mb-3">{t('checkout.emptyCart') || 'Your cart is empty'}</h2>
          <p className="text-black/60 mb-6">{t('checkout.emptyCartMessage') || 'Add some items to your cart before checking out'}</p>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="font-heading text-3xl sm:text-4xl mb-8 text-center">
          {t('merch.checkout') || 'Checkout'}
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="lux-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl mb-6">{t('checkout.shippingInfo') || 'Shipping Information'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('registration.name')} *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('registration.email')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('registration.phone')} *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('checkout.address') || 'Address'} *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('checkout.city') || 'City'} *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('checkout.postalCode') || 'Postal Code'} *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('checkout.country') || 'Country'} *</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-gold to-[#B8902F] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (t('checkout.processing') || 'Processing...') : (t('checkout.placeOrder') || 'Place Order')}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lux-card p-6 sm:p-8 h-fit sticky top-4">
            <h2 className="font-heading text-2xl mb-6">{t('checkout.orderSummary') || 'Order Summary'}</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-black/5 to-gold/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{item.category === 'clothing' ? '👕' : '☕'}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.name[lang] || item.name.en}</h3>
                    {item.size && <p className="text-xs text-black/60">Size: {item.size}</p>}
                    <p className="text-sm text-black/60">Qty: {item.quantity || 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{item.price * (item.quantity || 1)} NOK</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-black/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-black/60">{t('checkout.subtotal') || 'Subtotal'}:</span>
                <span className="font-medium">{getCartTotal()} NOK</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/60">{t('checkout.shipping') || 'Shipping'}:</span>
                <span className="font-medium">{t('checkout.free') || 'Free'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-black/10">
                <span>{t('merch.total') || 'Total'}:</span>
                <span className="text-gold">{getCartTotal()} NOK</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
