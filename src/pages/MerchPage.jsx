import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'

const merchItems = [
  {
    id: 'hoodie-black',
    name: { en: 'Surmedania Hoodie - Black', no: 'Surmedania Hettegenser - Svart', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਹੁੱਡੀ - ਕਾਲੀ' },
    price: 499,
    image: '/merch/hoodie-black.jpg',
    category: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: { 
      en: 'Premium cotton blend hoodie with embroidered logo',
      no: 'Premium bomullsblanding hettegenser med brodert logo',
      pa: 'ਕਢਾਈ ਵਾਲੇ ਲੋਗੋ ਦੇ ਨਾਲ ਪ੍ਰੀਮੀਅਮ ਕਪਾਹ ਮਿਸ਼ਰਣ ਹੁੱਡੀ'
    }
  },
  {
    id: 'hoodie-gold',
    name: { en: 'Surmedania Hoodie - Gold', no: 'Surmedania Hettegenser - Gull', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਹੁੱਡੀ - ਸੋਨੇ' },
    price: 499,
    image: '/merch/hoodie-gold.jpg',
    category: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: { 
      en: 'Premium cotton blend hoodie with embroidered logo',
      no: 'Premium bomullsblanding hettegenser med brodert logo',
      pa: 'ਕਢਾਈ ਵਾਲੇ ਲੋਗੋ ਦੇ ਨਾਲ ਪ੍ਰੀਮੀਅਮ ਕਪਾਹ ਮਿਸ਼ਰਣ ਹੁੱਡੀ'
    }
  },
  {
    id: 'tshirt-white',
    name: { en: 'Surmedania T-Shirt - White', no: 'Surmedania T-skjorte - Hvit', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਟੀ-ਸ਼ਰਟ - ਚਿੱਟੀ' },
    price: 299,
    image: '/merch/tshirt-white.jpg',
    category: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: { 
      en: 'Soft organic cotton t-shirt with screen-printed logo',
      no: 'Myk økologisk bomull t-skjorte med screentrykt logo',
      pa: 'ਸਕ੍ਰੀਨ-ਪ੍ਰਿੰਟ ਲੋਗੋ ਵਾਲੀ ਨਰਮ ਜੈਵਿਕ ਕਪਾਹ ਟੀ-ਸ਼ਰਟ'
    }
  },
  {
    id: 'tshirt-black',
    name: { en: 'Surmedania T-Shirt - Black', no: 'Surmedania T-skjorte - Svart', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਟੀ-ਸ਼ਰਟ - ਕਾਲੀ' },
    price: 299,
    image: '/merch/tshirt-black.jpg',
    category: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: { 
      en: 'Soft organic cotton t-shirt with screen-printed logo',
      no: 'Myk økologisk bomull t-skjorte med screentrykt logo',
      pa: 'ਸਕ੍ਰੀਨ-ਪ੍ਰਿੰਟ ਲੋਗੋ ਵਾਲੀ ਨਰਮ ਜੈਵਿਕ ਕਪਾਹ ਟੀ-ਸ਼ਰਟ'
    }
  },
  {
    id: 'mug',
    name: { en: 'Surmedania Coffee Mug', no: 'Surmedania Kaffekopp', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਕੌਫੀ ਮੱਗ' },
    price: 149,
    image: '/merch/mug.jpg',
    category: 'accessories',
    description: { 
      en: 'Ceramic mug with gold accent logo (350ml)',
      no: 'Keramisk kopp med gull aksentlogo (350ml)',
      pa: 'ਸੋਨੇ ਦੇ ਲਹਿਜੇ ਵਾਲੇ ਲੋਗੋ ਦੇ ਨਾਲ ਸਿਰੇਮਿਕ ਮੱਗ (350ml)'
    }
  },
  {
    id: 'waterbottle',
    name: { en: 'Surmedania Water Bottle', no: 'Surmedania Vannflaske', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਪਾਣੀ ਦੀ ਬੋਤਲ' },
    price: 199,
    image: '/merch/bottle.jpg',
    category: 'accessories',
    description: { 
      en: 'Stainless steel insulated bottle (500ml)',
      no: 'Rustfritt stål isolert flaske (500ml)',
      pa: 'ਸਟੇਨਲੈੱਸ ਸਟੀਲ ਇੰਸੂਲੇਟਡ ਬੋਤਲ (500ml)'
    }
  },
  {
    id: 'totebag',
    name: { en: 'Surmedania Tote Bag', no: 'Surmedania Handlepose', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਟੋਟ ਬੈਗ' },
    price: 179,
    image: '/merch/totebag.jpg',
    category: 'accessories',
    description: { 
      en: 'Canvas tote bag with printed logo',
      no: 'Lerret handlepose med trykt logo',
      pa: 'ਪ੍ਰਿੰਟ ਲੋਗੋ ਵਾਲਾ ਕੈਨਵਸ ਟੋਟ ਬੈਗ'
    }
  },
  {
    id: 'cap',
    name: { en: 'Surmedania Cap', no: 'Surmedania Caps', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਕੈਪ' },
    price: 249,
    image: '/merch/cap.jpg',
    category: 'accessories',
    description: { 
      en: 'Adjustable cotton cap with embroidered logo',
      no: 'Justerbar bomullscaps med brodert logo',
      pa: 'ਕਢਾਈ ਵਾਲੇ ਲੋਗੋ ਦੇ ਨਾਲ ਐਡਜਸਟ ਕਰਨ ਯੋਗ ਕਪਾਹ ਕੈਪ'
    }
  }
]

export default function MerchPage() {
  const { t, lang } = useLang()
  const { addToCart, cart, toggleCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')

  const filteredItems = selectedCategory === 'all' 
    ? merchItems 
    : merchItems.filter(item => item.category === selectedCategory)

  const handleAddToCart = (item) => {
    if (item.sizes && !selectedSize) {
      alert(t('merch.selectSize') || 'Please select a size')
      return
    }
    addToCart({ ...item, size: selectedSize })
    setSelectedProduct(null)
    setSelectedSize('')
    // Show success message
    setTimeout(() => toggleCart(), 300)
  }

  return (
    <>
      <section className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-gold/5 via-gold/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-gold/5 via-gold/10 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
            {t('merch.title') || 'Merch Store'}
          </h1>
          <p className="text-gold font-medium tracking-wide text-sm sm:text-base">
            {t('merch.subtitle') || 'Exclusive Surmedania merchandise'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-3 mb-8 sm:mb-12 flex-wrap"
        >
          {['all', 'clothing', 'accessories'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-gold to-[#B8902F] text-white shadow-md'
                  : 'border-2 border-gold/30 text-black/70 hover:border-gold hover:bg-gold/5'
              }`}
            >
              {t(`merch.category.${category}`) || category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group"
            >
              <div className="lux-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative aspect-square bg-gradient-to-br from-black/5 to-gold/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gold/20 text-6xl">
                    {item.category === 'clothing' ? '👕' : '☕'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-5">
                  <h3 className="font-heading text-lg mb-2 text-black/90">
                    {item.name[lang] || item.name.en}
                  </h3>
                  <p className="text-sm text-black/60 mb-3 line-clamp-2">
                    {item.description[lang] || item.description.en}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gold">{item.price} NOK</span>
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="px-4 py-2 bg-gradient-to-r from-gold to-[#B8902F] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      {t('merch.viewDetails') || 'View'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedProduct(null)
              setSelectedSize('')
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto cursor-default"
            >
              <div className="relative">
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    setSelectedSize('')
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black/70 hover:bg-white hover:text-black transition-colors z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="aspect-square bg-gradient-to-br from-black/5 to-gold/5 flex items-center justify-center text-gold/20 text-9xl">
                  {selectedProduct.category === 'clothing' ? '👕' : '☕'}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-2xl sm:text-3xl mb-3 text-black/90">
                  {selectedProduct.name[lang] || selectedProduct.name.en}
                </h2>
                <p className="text-black/60 mb-4">
                  {selectedProduct.description[lang] || selectedProduct.description.en}
                </p>
                <div className="text-3xl font-bold text-gold mb-6">{selectedProduct.price} NOK</div>

                {selectedProduct.sizes && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-3 text-black/80">
                      {t('merch.selectSize') || 'Select Size'} *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            selectedSize === size
                              ? 'bg-gradient-to-r from-gold to-[#B8902F] text-white shadow-md'
                              : 'border-2 border-black/20 text-black/70 hover:border-gold hover:bg-gold/5'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full py-4 bg-gradient-to-r from-gold to-[#B8902F] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  {t('merch.addToCart') || 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
