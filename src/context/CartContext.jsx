import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('surmedania_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('surmedania_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if item already exists (same id, size, and color)
      const existingIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.size === item.size &&
          cartItem.color === item.color
      )

      if (existingIndex !== -1) {
        // Item exists, increment quantity
        const newCart = [...prevCart]
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: (newCart[existingIndex].quantity || 1) + 1
        }
        return newCart
      } else {
        // New item, add to cart
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId, size, color) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === itemId && item.size === size && item.color === color))
    )
  }

  const updateQuantity = (itemId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    getCartTotal,
    getCartCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
