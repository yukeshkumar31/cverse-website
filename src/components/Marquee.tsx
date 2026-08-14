import { useI18n } from '../Language'

export function Marquee() {
  const { t } = useI18n()
  const items = [...t.marquee, ...t.marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={i}>
            {item} <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Stats() {
  const { t } = useI18n()
  return (
    <div className="wrap stats">
      {t.stats.map((s) => (
        <article className="stat" key={s.label}>
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </article>
      ))}
    </div>
  )
}
