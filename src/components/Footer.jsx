import React from 'react'
import { useLang } from '../context/LanguageContext'
import translations from '../i18n/translations.json'

function tEn(path, fallback = ''){
  const parts = path.split('.')
  let cur = translations['en']
  for (const p of parts){
    if (!cur) break
    cur = cur[p]
  }
  return (cur !== undefined && cur !== null) ? cur : fallback
}

export default function Footer(){
  const { t } = useLang()
  return (
    <footer className="relative isolate mt-12 border-t border-gold/20 bg-gradient-to-b from-offwhite to-white" role="contentinfo">
      {/* subtle decorative topper */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      {/* soft pattern backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-phulkari-pattern opacity-[0.04] bg-[length:180px_180px] bg-repeat" />

      <div className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-4">
          {/* Contact Section */}
          <div>
            <h3 className="font-heading text-base sm:text-lg mb-2 tracking-wide text-deepblack/90">{t('footer.contact') || 'Contact'}</h3>
            <div className="font-heading text-lg sm:text-xl leading-tight text-deepblack mb-2">Surmedania Dance School</div>
            <address className="not-italic text-sm text-deepblack/70 mb-2 leading-relaxed" aria-label={t('footer.address')}>{t('footer.address')}</address>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold flex-shrink-0 mt-0.5"><path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h3.3a2 2 0 0 1 1.9 1.37l1.1 3.3a2 2 0 0 1-.9 2.37l-1.8 1.08a11 11 0 0 0 5.2 5.2l1.07-1.8a2 2 0 0 1 2.38-.9l3.3 1.1A2 2 0 0 1 21 17v2a2 2 0 0 1-2 2h-.5C9.61 21 3 14.39 3 6.5V5Z"/></svg>
                <span className="text-deepblack/70 leading-relaxed">
                  <span className="font-medium block sm:inline mr-1">{t('footer.phoneLabel') || 'Phone'}:</span>
                  <a href="tel:+4746960880" className="underline decoration-gold/50 underline-offset-2 hover:text-deepblack hover:decoration-gold transition break-all">+47 46960880</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold flex-shrink-0 mt-0.5"><path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v1.2l-10 6.25L2 8.2V7a2 2 0 0 1 2-2Zm16 14H4a2 2 0 0 1-2-2V10.4l10 6.25 10-6.25V17a2 2 0 0 1-2 2Z"/></svg>
                <span className="text-deepblack/70 leading-relaxed">
                  <span className="font-medium block sm:inline mr-1">{t('footer.emailLabel') || 'Email'}:</span>
                  <a href="mailto:surmedania@gmail.com" className="underline decoration-gold/50 underline-offset-2 hover:text-deepblack hover:decoration-gold transition break-all">surmedania@gmail.com</a>
                </span>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="text-center md:text-left md:ml-32">
            <h3 id="footer-social-heading" className="font-heading text-base sm:text-lg mb-2 tracking-wide text-deepblack/90">{t('footer.follow') || 'Follow'}</h3>
            <nav aria-labelledby="footer-social-heading">
              <ul className="flex flex-col sm:flex-row sm:flex-wrap items-center md:items-start gap-2">
                <li className="w-full sm:w-auto">
                  <a
                    href="https://www.instagram.com/surmedania?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('footer.instagram') || 'Instagram'} ${t('footer.opensNewTab') || ''}`.trim()}
                    className="group inline-flex items-center gap-2 rounded-full border-2 border-gold/30 px-3 py-1.5 text-deepblack/70 transition hover:border-gold/60 hover:bg-gold/10 hover:text-deepblack w-full sm:w-auto justify-center text-sm"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current opacity-80 group-hover:opacity-100"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                    <span className="font-medium tracking-wide">{t('footer.instagram') || 'Instagram'}</span>
                  </a>
                </li>
                <li className="w-full sm:w-auto">
                  <a
                    href="https://www.facebook.com/profile.php?id=61565917691358"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('footer.facebook') || 'Facebook'} ${t('footer.opensNewTab') || ''}`.trim()}
                    className="group inline-flex items-center gap-2 rounded-full border-2 border-gold/30 px-3 py-1.5 text-deepblack/70 transition hover:border-gold/60 hover:bg-gold/10 hover:text-deepblack w-full sm:w-auto justify-center text-sm"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current opacity-80 group-hover:opacity-100"><path d="M13.5 9H15V6h-1.5C11.57 6 10 7.57 10 9.5V11H8v3h2v6h3v-6h2.1l.4-3H13v-1.5c0-.28.22-.5.5-.5z"/></svg>
                    <span className="font-medium tracking-wide">{t('footer.facebook') || 'Facebook'}</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright Section - At the very bottom */}
        <div className="text-center text-xs text-deepblack/60 space-y-0.5">
          <p>© {new Date().getFullYear()} Surmedania. {tEn('footer.rightsReserved', 'All rights reserved.')}</p>
          <a
            href="https://JugadBoparai.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tEn('footer.credit')} ${tEn('footer.opensNewTab')}`}
            className="inline-block hover:text-deepblack/80 hover:underline underline-offset-2 transition"
          >
            {tEn('footer.credit')}
          </a>
        </div>
      </div>
    </footer>
  )
}
