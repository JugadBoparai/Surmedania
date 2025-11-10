import React, { useEffect, useState, useMemo } from 'react'
import { MotionConfig } from 'framer-motion'

/**
 * MotionProvider centralizes reduced motion handling.
 * It listens to prefers-reduced-motion and updates framer-motion's reducedMotion.
 */
export default function MotionProvider({ children }) {
  const [shouldReduce, setShouldReduce] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = () => setShouldReduce(mq.matches)
    try {
      mq.addEventListener('change', listener)
    } catch(e) {
      // Safari < 14 fallback
      mq.addListener(listener)
    }
    return () => {
      try { mq.removeEventListener('change', listener) } catch(e) { mq.removeListener(listener) }
    }
  }, [])

  const reducedMotionSetting = shouldReduce ? 'always' : 'never'

  // Optionally we can memoize to avoid re-renders of subtree on unrelated state.
  const config = useMemo(() => ({ reducedMotion: reducedMotionSetting }), [reducedMotionSetting])

  return (
    <MotionConfig reducedMotion={config.reducedMotion}>
      {children}
    </MotionConfig>
  )
}
