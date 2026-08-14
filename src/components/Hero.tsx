import { motion, useMotionValue, useSpring } from 'framer-motion'
import { MouseEvent, ReactNode, useRef, useEffect, useState } from 'react'
import { useI18n } from '../Language'
import { waLink } from '../i18n'
import { LogoMark } from './LogoMark'

const LINES = [
  '> CVERSE.boot()',
  'Think.',
  'Build.',
  'Evolve.',
  'Compiling first app…',
  '[████████████] 100%',
  'App launched. You built this.',
]

function Magnetic({
  href,
  className,
  children,
}: {
  href: string
  className: string
  children: ReactNode
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 180, damping: 15 })
  const y = useSpring(my, { stiffness: 180, damping: 15 })

  const move = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width / 2) * 0.35)
    my.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  const leave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x, y }}
      onMouseMove={move}
      onMouseLeave={leave}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
    >
      {children}
    </motion.a>
  )
}

export function Hero() {
  const { t } = useI18n()
  const [typed, setTyped] = useState('')

  useEffect(() => {
    const full = LINES.join('\n')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(full.slice(0, i))
      if (i >= full.length) window.clearInterval(id)
    }, 28)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__grid" />
      <div className="orb orb--a" />
      <div className="orb orb--b" />
      <div className="orb orb--c" />
      <div className="wrap hero__layout">
        <div>
          <LogoMark variant="monitor" className="hero-logo" />
          <div className="kicker">{t.hero.kicker}</div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{t.hero.titleA}</span>
            <span className="cyan">{t.hero.titleB}</span>
            <span className="gold">{t.hero.titleC}</span>
          </motion.h1>
          <p className="hero__headline">{t.hero.headline}</p>
          <p className="hero__sub">{t.hero.sub}</p>
          <p className="hero__worry">{t.hero.worry}</p>
          <div className="hero__ctas">
            <Magnetic className="btn btn--gold" href={waLink()}>
              {t.hero.cta}
            </Magnetic>
            <Magnetic className="btn btn--ghost" href="#curriculum">
              {t.hero.secondary}
            </Magnetic>
          </div>
          <div className="fun">{t.hero.fun}</div>
        </div>
        <div className="stage">
          <motion.figure
            className="polaroid polaroid--1"
            initial={{ y: 40, opacity: 0, rotate: -14 }}
            animate={{ y: 0, opacity: 1, rotate: -8 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            whileHover={{ rotate: -2, y: -8, scale: 1.03 }}
          >
            <img src="/images/poster-1.png" alt="Cverse campaign — Think. Build. Evolve." />
            <figcaption>Think. Build. Evolve.</figcaption>
          </motion.figure>
          <motion.figure
            className="polaroid polaroid--2"
            initial={{ y: 50, opacity: 0, rotate: 14 }}
            animate={{ y: 0, opacity: 1, rotate: 7 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            whileHover={{ rotate: 2, y: -10, scale: 1.03 }}
          >
            <img src="/images/poster-2.png" alt="Cverse program for school students 8th to 12th" />
            <figcaption>Let’s Fun-Code</figcaption>
          </motion.figure>
          <motion.div
            className="terminal"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="terminal__bar">
              <i />
              <i />
              <i />
            </div>
            <pre>
              {typed}
              <span className="caret" />
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
