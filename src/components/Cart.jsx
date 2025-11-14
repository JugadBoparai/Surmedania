import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLang } from '../context/LanguageContext'

export default function Cart() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
  const { t, lang } = useLang()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-2xl text-black/90">
                  {t('merch.cart') || 'Shopping Cart'}
                </h2>
                {getCartCount() > 0 && (
                  <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <button
                onClick={toggleCart}
                className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                  {/* Animated empty cart illustration */}
                  <div className="relative mb-6">
                    <div className="text-8xl text-gold/20 animate-bounce">🛒</div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                  <h3 className="font-heading text-xl text-black/90 mb-2">
                    {t('cart.emptyTitle') || 'Your cart is waiting'}
                  </h3>
                  <p className="text-sm text-black/60 mb-6 max-w-xs">
                    {t('cart.emptyMessage') || 'Add some amazing Surmedania merch to get started. Check out our exclusive collection!'}
                  </p>
                  <Link
                    to="/merch"
                    onClick={toggleCart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-[#B8902F] text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{t('merch.shopNow') || 'Shop Now'}</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 border-2 border-black/10 rounded-lg hover:border-gold/30 transition-colors"
                    >
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-black/5 to-gold/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{item.category === 'clothing' ? '👕' : '☕'}</span>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-black/90 truncate">
                          {item.name[lang] || item.name.en}
                        </h3>
                        {item.size && (
                          <p className="text-xs text-black/60 mt-1">
                            {t('merch.size') || 'Size'}: {item.size}
                          </p>
                        )}
                        <p className="text-gold font-bold mt-1">{item.price} NOK</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border-2 border-black/20 hover:border-gold hover:bg-gold/5 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border-2 border-black/20 hover:border-gold hover:bg-gold/5 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                            className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            {t('merch.remove') || 'Remove'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-black/10 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-black/80">{t('merch.total') || 'Total'}:</span>
                  <span className="font-bold text-2xl text-gold">{getCartTotal()} NOK</span>
                </div>
                <Link
                  to="/merch/checkout"
                  onClick={toggleCart}
                  className="block w-full py-4 bg-gradient-to-r from-gold to-[#B8902F] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 text-center"
                >
                  {t('merch.checkout') || 'Proceed to Checkout'}
                </Link>
                <Link
                  to="/merch"
                  onClick={toggleCart}
                  className="block w-full text-center text-sm text-black/60 hover:text-black transition-colors"
                >
                  {t('merch.continueShopping') || 'Continue shopping'}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
