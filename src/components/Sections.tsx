import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useI18n } from '../Language'

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

export function Mission() {
  const { t } = useI18n()
  return (
    <section id="program">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t.mission.kicker}</div>
          <h2>{t.mission.title}</h2>
        </div>
        <div className="mission-grid">
          <div className="mission-copy">
            <p>{t.mission.body}</p>
          </div>
          <div className="points">
            {t.mission.points.map((p, i) => (
              <motion.article
                className="point"
                key={p.t}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <b>{p.t}</b>
                <span>{p.d}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Curriculum() {
  const { t } = useI18n()
  return (
    <section id="curriculum">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t.curriculum.kicker}</div>
          <h2>{t.curriculum.title}</h2>
          <p>{t.curriculum.body}</p>
        </div>
        <div className="modules">
          {t.curriculum.modules.map((m, i) => (
            <TiltCard key={m.code} delay={i * 0.06}>
              <div className="module__code">{m.code}</div>
              <h3>{m.title}</h3>
              <ul>
                {m.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function TiltCard({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <motion.article
      className="module"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -10, rotateX: 6, rotateY: -6, scale: 1.02 }}
      style={{ transformPerspective: 800 }}
    >
      {children}
    </motion.article>
  )
}

export function Journey() {
  const { t } = useI18n()
  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t.journey.kicker}</div>
          <h2>{t.journey.title}</h2>
        </div>
        <div className="steps">
          {t.journey.steps.map((s, i) => (
            <motion.article
              className="step"
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
            >
              <b>{s.n}</b>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
