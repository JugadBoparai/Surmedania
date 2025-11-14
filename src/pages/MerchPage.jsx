import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'

const merchItems = [
  {
    id: 'hoodie',
    name: { en: 'Surmedania Hoodie', no: 'Surmedania Hettegenser', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਹੁੱਡੀ' },
    price: 499,
    image: '/merch/hoodie-black.jpg',
    category: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 'black', name: { en: 'Black', no: 'Svart', pa: 'ਕਾਲਾ' }, hex: '#000000' },
      { id: 'gold', name: { en: 'Gold', no: 'Gull', pa: 'ਸੋਨਾ' }, hex: '#C9A74A' },
      { id: 'navy', name: { en: 'Navy', no: 'Marineblå', pa: 'ਨੇਵੀ' }, hex: '#1e3a8a' }
    ],
    description: { 
      en: 'Premium cotton blend hoodie with embroidered logo',
      no: 'Premium bomullsblanding hettegenser med brodert logo',
      pa: 'ਕਢਾਈ ਵਾਲੇ ਲੋਗੋ ਦੇ ਨਾਲ ਪ੍ਰੀਮੀਅਮ ਕਪਾਹ ਮਿਸ਼ਰਣ ਹੁੱਡੀ'
    }
  },
  {
    id: 'crewneck',
    name: { en: 'Surmedania Crewneck Sweatshirt', no: 'Surmedania College Genser', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਕ੍ਰੂਨੈੱਕ' },
    price: 449,
    image: '/merch/crewneck-black.jpg',
    category: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 'black', name: { en: 'Black', no: 'Svart', pa: 'ਕਾਲਾ' }, hex: '#000000' },
      { id: 'gold', name: { en: 'Gold', no: 'Gull', pa: 'ਸੋਨਾ' }, hex: '#C9A74A' },
      { id: 'grey', name: { en: 'Grey', no: 'Grå', pa: 'ਸਲੇਟੀ' }, hex: '#6B7280' }
    ],
    description: { 
      en: 'Classic college-style crewneck sweatshirt with embroidered logo',
      no: 'Klassisk college-stil genser med brodert logo',
      pa: 'ਕਢਾਈ ਵਾਲੇ ਲੋਗੋ ਦੇ ਨਾਲ ਕਲਾਸਿਕ ਕਾਲਜ-ਸਟਾਈਲ ਕ੍ਰੂਨੈੱਕ'
    }
  },
  {
    id: 'tshirt',
    name: { en: 'Surmedania T-Shirt', no: 'Surmedania T-skjorte', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਟੀ-ਸ਼ਰਟ' },
    price: 299,
    image: '/merch/tshirt-white.jpg',
    category: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 'white', name: { en: 'White', no: 'Hvit', pa: 'ਚਿੱਟਾ' }, hex: '#FFFFFF' },
      { id: 'black', name: { en: 'Black', no: 'Svart', pa: 'ਕਾਲਾ' }, hex: '#000000' },
      { id: 'gold', name: { en: 'Gold', no: 'Gull', pa: 'ਸੋਨਾ' }, hex: '#C9A74A' }
    ],
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
    id: 'stickers',
    name: { en: 'Surmedania Sticker Pack', no: 'Surmedania Klistremerke Pakke', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਸਟਿੱਕਰ ਪੈਕ' },
    price: 49,
    image: '/merch/stickers.jpg',
    category: 'accessories',
    description: { 
      en: 'Set of 5 weather-resistant vinyl stickers',
      no: 'Sett med 5 værbestandige vinylklistremerker',
      pa: 'ਮੌਸਮ-ਰੋਧਕ ਵਿਨਾਇਲ ਸਟਿੱਕਰਾਂ ਦਾ ਸੈੱਟ (5)'
    }
  },
  {
    id: 'bottleopener',
    name: { en: 'Surmedania Bottle Opener', no: 'Surmedania Flaskeåpner', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਬੋਤਲ ਓਪਨਰ' },
    price: 99,
    image: '/merch/opener.jpg',
    category: 'accessories',
    description: { 
      en: 'Durable metal bottle opener with engraved logo',
      no: 'Holdbar metallflaskeåpner med gravert logo',
      pa: 'ਉੱਕਰੀ ਹੋਈ ਲੋਗੋ ਦੇ ਨਾਲ ਟਿਕਾਊ ਮੈਟਲ ਬੋਤਲ ਓਪਨਰ'
    }
  },
  {
    id: 'pens',
    name: { en: 'Surmedania Pen Set', no: 'Surmedania Penn Sett', pa: 'ਸੁਰਮੇਦਾਨੀਆ ਪੈੱਨ ਸੈੱਟ' },
    price: 79,
    image: '/merch/pens.jpg',
    category: 'accessories',
    description: { 
      en: 'Set of 3 quality ballpoint pens with logo',
      no: 'Sett med 3 kvalitetskulepenn med logo',
      pa: 'ਲੋਗੋ ਦੇ ਨਾਲ 3 ਗੁਣਵੱਤਾ ਵਾਲੇ ਬਾਲਪੁਆਇੰਟ ਪੈੱਨਾਂ ਦਾ ਸੈੱਟ'
    }
  }
]

export default function MerchPage() {
  const { t, lang } = useLang()
  const { addToCart, cart, toggleCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const filteredItems = selectedCategory === 'all' 
    ? merchItems 
    : merchItems.filter(item => item.category === selectedCategory)

  const handleAddToCart = (item) => {
    if (item.sizes && !selectedSize) {
      alert(t('merch.selectSize') || 'Please select a size')
      return
    }
    if (item.colors && !selectedColor) {
      alert(t('merch.selectColor') || 'Please select a color')
      return
    }
    
    const cartItem = { 
      ...item, 
      size: selectedSize,
      color: selectedColor,
      // Create unique ID with color for cart
      id: item.colors ? `${item.id}-${selectedColor}` : item.id,
      // Update name to include color if applicable
      displayName: item.colors && selectedColor 
        ? `${item.name[lang] || item.name.en} - ${item.colors.find(c => c.id === selectedColor)?.name[lang] || selectedColor}`
        : item.name[lang] || item.name.en
    }
    
    addToCart(cartItem)
    setSelectedProduct(null)
    setSelectedSize('')
    setSelectedColor('')
    // Show success message
    setTimeout(() => toggleCart(), 300)
  }

  // Generate placeholder image based on item type
  const getPlaceholderIcon = (itemId) => {
    const icons = {
      hoodie: '🧥',
      crewneck: '👔',
      tshirt: '👕',
      socks: '🧦',
      mug: '☕',
      waterbottle: '🚰',
      totebag: '👜',
      stickers: '✨',
      bottleopener: '🍺',
      pens: '✒️'
    }
    return icons[itemId] || '🎁'
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
              className="group h-full"
            >
              <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-black/5">
                {/* Image Container */}
                <div className="relative aspect-square bg-gradient-to-br from-gold/8 via-white to-gold/5 overflow-hidden">
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                      backgroundSize: '32px 32px'
                    }} />
                  </div>
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Product icon */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-9xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
                      {getPlaceholderIcon(item.id)}
                    </div>
                  </div>
                  
                  {/* Logo watermark */}
                  <div className="absolute bottom-4 right-4 text-gold/15 font-heading text-xs tracking-widest uppercase">
                    Surmedania
                  </div>
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                
                {/* Content Container */}
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="font-heading text-lg sm:text-xl mb-2 text-black/90 tracking-tight leading-tight">
                    {item.name[lang] || item.name.en}
                  </h3>
                  <p className="text-sm text-black/60 mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {item.description[lang] || item.description.en}
                  </p>
                  
                  {/* Price and Button */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/5">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold bg-gradient-to-r from-gold to-[#B8902F] bg-clip-text text-transparent">
                        {item.price}
                      </span>
                      <span className="text-xs text-black/40 font-medium">NOK</span>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="px-5 py-2.5 bg-gradient-to-r from-gold to-[#B8902F] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
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
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto cursor-default"
            >
              <button
                onClick={() => {
                  setSelectedProduct(null)
                  setSelectedSize('')
                  setSelectedColor('')
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black/70 hover:bg-white hover:text-black transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid md:grid-cols-2 gap-6 p-6 sm:p-8">
                {/* Left side - Image */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gold/10 via-white to-gold/5 rounded-xl flex items-center justify-center sticky top-6 overflow-hidden">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                      }} />
                    </div>
                    
                    {/* Product icon */}
                    <div className="text-9xl">
                      {getPlaceholderIcon(selectedProduct.id)}
                    </div>
                    
                    {/* Logo watermark */}
                    <div className="absolute bottom-6 right-6 text-gold/20 font-heading text-lg">
                      Surmedania
                    </div>
                  </div>
                </div>

                {/* Right side - Details and Options */}
                <div className="flex flex-col">
                  <h2 className="font-heading text-2xl sm:text-3xl mb-3 text-black/90">
                    {selectedProduct.name[lang] || selectedProduct.name.en}
                  </h2>
                  <p className="text-black/60 mb-4">
                    {selectedProduct.description[lang] || selectedProduct.description.en}
                  </p>
                  <div className="text-3xl font-bold text-gold mb-6">{selectedProduct.price} NOK</div>

                  {selectedProduct.colors && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-3 text-black/80">
                        {t('merch.selectColor') || 'Select Color'} *
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor(color.id)}
                            className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedColor === color.id
                                ? 'bg-gradient-to-r from-gold to-[#B8902F] text-white shadow-md'
                                : 'border-2 border-black/20 text-black/70 hover:border-gold hover:bg-gold/5'
                            }`}
                          >
                            <span 
                              className="w-6 h-6 rounded-full border-2 border-black/20"
                              style={{ 
                                backgroundColor: color.hex,
                                ...(color.hex === '#FFFFFF' && { borderColor: '#ddd' })
                              }}
                            />
                            <span>{color.name[lang] || color.name.en}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                    className="w-full py-4 bg-gradient-to-r from-gold to-[#B8902F] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 mt-auto"
                  >
                    {t('merch.addToCart') || 'Add to Cart'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
