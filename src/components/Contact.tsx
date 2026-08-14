import { FormEvent, useState } from 'react'
import { useI18n } from '../Language'
import { CALL, MAPS, waLink } from '../i18n'
import { Logo } from './Logo'

export function Contact() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState<string>(t.contact.grades[0])
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = `Hi Cverse, I want to join.\nName: ${name}\nGrade: ${grade}\nPhone: ${phone}\n${message}`
    window.open(waLink(text), '_blank')
  }

  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t.contact.kicker}</div>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.body}</p>
        </div>
        <div className="contact-grid">
          <div className="info-card">
            <h3>{t.contact.address}</h3>
            <p className="addr">{t.contact.body}</p>
            <div className="phones">
              <a className="btn" href={`tel:+${CALL}`}>
                {t.contact.call} 86103 28099
              </a>
              <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noreferrer">
                {t.contact.whatsapp} 88838 24177
              </a>
            </div>
            <a className="btn btn--ghost" href={MAPS} target="_blank" rel="noreferrer">
              {t.contact.map}
            </a>
          </div>
          <form className="form" onSubmit={onSubmit}>
            <h3>{t.contact.formTitle}</h3>
            <label>
              {t.contact.name}
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              {t.contact.grade}
              <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                {t.contact.grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.contact.phone}
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            <label>
              {t.contact.message}
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <button className="btn btn--gold" type="submit">
              {t.contact.send}
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
    <footer className="wrap footer">
      <Logo />
      <p>{t.footer.tag}</p>
      <p>{t.footer.rights}</p>
    </footer>
  )
}
