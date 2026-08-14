import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogoMark } from './LogoMark'

export function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2800)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="preloader__inner">
        <LogoMark variant="monitor" animated className="preloader__logo" />
        <div className="preloader__tag">Think. Build. Evolve.</div>
        <div className="preloader__bar">
          <motion.div
            className="preloader__fill"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.4, ease: 'easeInOut' }}
          />
        </div>
        <div className="preloader__hint">Booting the studio</div>
      </div>
    </motion.div>
  )
}
