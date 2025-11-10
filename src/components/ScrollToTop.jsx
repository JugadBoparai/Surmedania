import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Behavior:
// - Default: jump to top instantly on any route change
// - Exception: when navigating to /classes#location, smoothly scroll to the #location section
// - Accessibility: Sets focus and announces navigation for assistive technology
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    // Special case: for /classes#location first show the top of Classes, then custom-ease scroll down
    if (hash === '#location') {
      const prefersReduced = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

      // Stage 1: immediately jump to top so the user sees the page start
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

      // Stage 2: after a short delay, animate with a gentle cubic easing
      let attempts = 0
      const maxAttempts = 20 // ~1s with 50ms spacing
      const headerOffset = 72

      const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

      const animateScroll = (targetTop, duration = 700, callback) => {
        if (prefersReduced) {
          window.scrollTo({ top: targetTop, left: 0, behavior: 'auto' })
          if (callback) callback()
          return
        }
        const start = window.pageYOffset || document.documentElement.scrollTop
        const distance = targetTop - start
        const startTime = performance.now()

        const tick = (now) => {
          const elapsed = now - startTime
          const t = Math.min(1, elapsed / duration)
          const eased = easeInOutCubic(t)
          window.scrollTo(0, start + distance * eased)
          if (t < 1) {
            requestAnimationFrame(tick)
          } else if (callback) {
            callback()
          }
        }
        requestAnimationFrame(tick)
      }

      const tryScroll = () => {
        const el = document.querySelector(hash)
        if (el) {
          const rect = el.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const top = rect.top + scrollTop - headerOffset
          animateScroll(top, 800, () => {
            // After scroll completes, set focus for keyboard/screen reader users
            el.focus({ preventScroll: true })
            // Announce the navigation
            const label = el.getAttribute('aria-label') || 'Location section'
            setAnnouncement(`Navigated to ${label}`)
            // Clear announcement after a delay
            setTimeout(() => setAnnouncement(''), 1000)
          })
        } else if (attempts < maxAttempts) {
          attempts += 1
          setTimeout(tryScroll, 50)
        }
      }
      // Wait a touch (200ms) before attempting to scroll so the top is perceptible
      setTimeout(() => requestAnimationFrame(tryScroll), 200)
      return
    }

    // Default behavior for all other navigations: instant jump to top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}
