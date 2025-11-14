import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

// Site organization component for professional structure display
export default function SiteMap() {
  const { t } = useLang()

  const siteStructure = [
    {
      title: t('nav.home') || 'Home',
      path: '/',
      icon: '🏠',
      description: 'Landing page with hero and quick info'
    },
    {
      title: t('nav.about') || 'About',
      path: '/about',
      icon: '👥',
      description: 'Our story, founder, styles & gallery',
      children: [
        { title: 'Dance Styles', path: '/about#styles' },
        { title: 'Gallery', path: '/about#gallery' }
      ]
    },
    {
      title: t('nav.classes') || 'Classes',
      path: '/classes',
      icon: '📅',
      description: 'Schedule, calendar & class details'
    },
    {
      title: t('nav.news') || 'News',
      path: '/news',
      icon: '📰',
      description: 'Events, performances & updates'
    },
    {
      title: t('nav.merch') || 'Merch',
      path: '/merch',
      icon: '🛍️',
      description: 'Exclusive merchandise & apparel',
      children: [
        { title: 'Checkout', path: '/merch/checkout' }
      ]
    },
    {
      title: t('nav.registration') || 'Registration',
      path: '/registration',
      icon: '✍️',
      description: 'Join as active or supported member'
    },
    {
      title: t('nav.faq') || 'FAQ',
      path: '/faq',
      icon: '❓',
      description: 'Frequently asked questions'
    },
    {
      title: t('nav.contact') || 'Contact',
      path: '/feedback',
      icon: '📧',
      description: 'Get in touch with us'
    }
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl mb-3">Site Map</h2>
          <p className="text-black/60 text-sm">Navigate through all pages and sections</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {siteStructure.map((section, idx) => (
            <div
              key={idx}
              className="lux-card p-5 hover:shadow-xl transition-all duration-300 group"
            >
              <Link to={section.path} className="block">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {section.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg mb-1 text-black/90 group-hover:text-gold transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs text-black/60 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
              
              {section.children && section.children.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black/5">
                  <ul className="space-y-1">
                    {section.children.map((child, childIdx) => (
                      <li key={childIdx}>
                        <Link
                          to={child.path}
                          className="text-xs text-black/60 hover:text-gold transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Organizational Hierarchy */}
        <div className="mt-12 lux-card p-6 sm:p-8">
          <h3 className="font-heading text-xl mb-6 text-center">Site Hierarchy</h3>
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-gold to-[#B8902F] text-white font-semibold rounded-lg shadow-md">
                Surmedania Dance School
              </div>
            </div>
            <div className="w-px h-8 bg-gold/30"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="px-4 py-2 border-2 border-gold/30 rounded-lg">
                  Information
                </div>
                <div className="text-xs text-black/50 mt-1">About, FAQ</div>
              </div>
              <div>
                <div className="px-4 py-2 border-2 border-gold/30 rounded-lg">
                  Programs
                </div>
                <div className="text-xs text-black/50 mt-1">Classes, Styles</div>
              </div>
              <div>
                <div className="px-4 py-2 border-2 border-gold/30 rounded-lg">
                  Community
                </div>
                <div className="text-xs text-black/50 mt-1">News, Events</div>
              </div>
              <div>
                <div className="px-4 py-2 border-2 border-gold/30 rounded-lg">
                  Actions
                </div>
                <div className="text-xs text-black/50 mt-1">Register, Shop</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
