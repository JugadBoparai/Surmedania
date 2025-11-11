import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Home from './pages/Home'
import DevI18nPanel from './components/DevI18nPanel'
import About from './pages/About'
import Classes from './pages/Classes'
import GalleryPage from './pages/GalleryPage'
import NewsPage from './pages/NewsPage'
import RegistrationPage from './pages/RegistrationPage'
import RegistrationConfirm from './pages/RegistrationConfirm'
import PaymentComplete from './pages/PaymentComplete'
import FAQPage from './pages/FAQPage'
import NotFound from './pages/NotFound'
import FeedbackPage from './pages/FeedbackPage'
import Styles from './pages/Styles'
import MerchPage from './pages/MerchPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderCompletePage from './pages/OrderCompletePage'

export default function App(){
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-offwhite">
          <Header />
          <ScrollToTop />
          <Cart />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/registration/confirm" element={<RegistrationConfirm />} />
              <Route path="/registration/payment-complete" element={<PaymentComplete />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/styles" element={<Styles />} />
              <Route path="/merch" element={<MerchPage />} />
              <Route path="/merch/checkout" element={<CheckoutPage />} />
              <Route path="/merch/order-complete" element={<OrderCompletePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <DevI18nPanel />
        </div>
      </CartProvider>
    </LanguageProvider>
  )
}
