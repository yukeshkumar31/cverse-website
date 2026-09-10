import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogoMark } from './LogoMark'

export function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(onDone, reduced ? 200 : 1600)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      className="preloader"
      role="status"
      aria-live="polite"
      aria-label="Loading Cverse"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="preloader__inner">
        <LogoMark variant="monitor" animated className="preloader__logo" />
        <div className="preloader__tag">Think. Build. Evolve.</div>
        <div className="preloader__bar" aria-hidden="true">
          <motion.div
            className="preloader__fill"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        </div>
        <div className="preloader__hint">Loading the studio</div>
        <button type="button" className="preloader__skip" onClick={onDone}>
          Skip
        </button>
      </div>
    </motion.div>
  )
}
