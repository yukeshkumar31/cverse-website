import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../Language'
import { waLink } from '../i18n'

function useCount(to: number, start: boolean) {
  const [n, setN] = useState(to)
  useEffect(() => {
    if (!start) return
    const from = 20000
    const duration = 1400
    const t0 = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(from + (to - from) * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, to])
  return n
}

export function Scholarship() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const amount = useCount(5000, inView)

  return (
    <section id="scholarship">
      <div className="wrap">
        <motion.div
          className="scholar"
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="kicker">{t.scholarship.kicker}</div>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', margin: '12px 0 16px' }}>
              {t.scholarship.title}
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, maxWidth: '52ch' }}>
              {t.scholarship.body}
            </p>
            <p style={{ margin: '18px 0 24px', color: '#d7e6f8' }}>{t.scholarship.note}</p>
            <a className="btn btn--gold" href={waLink()} target="_blank" rel="noreferrer">
              {t.scholarship.cta}
            </a>
          </div>
          <div className="price-card">
            <div className="was">
              {t.scholarship.was} ₹20,000
            </div>
            <div className="now">₹{amount.toLocaleString('en-IN')}</div>
            <div className="upto">{t.scholarship.upto}</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Why() {
  const { t } = useI18n()
  return (
    <section id="why">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t.why.kicker}</div>
          <h2>{t.why.title}</h2>
        </div>
        <div className="why-grid">
          {t.why.items.map((item, i) => (
            <motion.article
              className="why-card"
              key={item.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -8 }}
            >
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQ() {
  const { t } = useI18n()
  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t.faq.kicker}</div>
          <h2>{t.faq.title}</h2>
        </div>
        <div className="faq">
          {t.faq.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
