import { FormEvent, useEffect, useId, useState } from 'react'
import { useI18n } from '../Language'
import { CALL, MAPS, waLink } from '../i18n'
import { Logo } from './Logo'

export function Contact() {
  const { t, lang } = useI18n()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState<string>(t.contact.grades[0])
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')
  const ids = {
    name: useId(),
    grade: useId(),
    phone: useId(),
    message: useId(),
  }

  useEffect(() => {
    setGrade(t.contact.grades[0])
  }, [lang, t.contact.grades])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = `Hi Cverse, I want to join.\nName: ${name}\nGrade: ${grade}\nPhone: ${phone}\n${message}`
    setStatus('sent')
    window.open(waLink(text), '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setStatus('idle'), 2500)
  }

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t.contact.kicker}</div>
          <h2 id="contact-title">{t.contact.title}</h2>
          <p>{t.contact.body}</p>
        </div>
        <div className="contact-grid">
          <div className="info-card">
            <p className="info-card__label">{t.contact.locationLabel}</p>
            <h3 className="info-card__address">{t.contact.address}</h3>
            <div className="phones">
              <a className="btn" href={`tel:+${CALL}`}>
                {t.contact.call} 86103 28099
              </a>
              <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noopener noreferrer">
                {t.contact.whatsapp} 88838 24177
              </a>
            </div>
            <a className="btn btn--ghost" href={MAPS} target="_blank" rel="noopener noreferrer">
              {t.contact.map}
            </a>
          </div>
          <form className="form" onSubmit={onSubmit} noValidate={false}>
            <h3>{t.contact.formTitle}</h3>
            <label htmlFor={ids.name}>
              {t.contact.name}
              <input
                id={ids.name}
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label htmlFor={ids.grade}>
              {t.contact.grade}
              <select id={ids.grade} name="grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
                {t.contact.grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor={ids.phone}>
              {t.contact.phone}
              <input
                id={ids.phone}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>
            <label htmlFor={ids.message}>
              {t.contact.message}
              <textarea id={ids.message} name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <button className="btn btn--gold" type="submit">
              {status === 'sent' ? t.contact.sent : t.contact.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer-wrap">
      <div className="wrap footer">
        <div className="footer__brand">
          <Logo />
          <p>{t.footer.tag}</p>
        </div>
        <div className="footer__cols">
          <div>
            <p className="footer__heading">{t.footer.explore}</p>
            <nav className="footer__links" aria-label="Footer">
              <a href="#program">{t.nav.program}</a>
              <a href="#curriculum">{t.nav.curriculum}</a>
              <a href="#scholarship">{t.nav.scholarship}</a>
              <a href="#faq">{t.nav.faq}</a>
            </nav>
          </div>
          <div>
            <p className="footer__heading">{t.footer.getInTouch}</p>
            <nav className="footer__links" aria-label="Contact links">
              <a href="#contact">{t.nav.contact}</a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                {t.contact.whatsapp}
              </a>
              <a href={`tel:+${CALL}`}>{t.contact.call}</a>
              <a href={MAPS} target="_blank" rel="noopener noreferrer">
                {t.contact.map}
              </a>
            </nav>
          </div>
        </div>
        <p className="footer__rights">{t.footer.rights}</p>
      </div>
    </footer>
  )
}
