import { useState } from 'react'
import { Logo } from './Logo'
import { useI18n } from '../Language'
import { waLink } from '../i18n'

export function Navbar() {
  const { t, lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className={`nav ${open ? 'is-open' : ''}`}>
      <Logo />
      <nav className="nav__links" onClick={close}>
        <a href="#program">{t.nav.program}</a>
        <a href="#curriculum">{t.nav.curriculum}</a>
        <a href="#scholarship">{t.nav.scholarship}</a>
        <a href="#why">{t.nav.why}</a>
        <a href="#contact">{t.nav.contact}</a>
      </nav>
      <div className="nav__right">
        <div className="lang" role="group" aria-label="Language">
          <button className={lang === 'en' ? 'is-on' : ''} onClick={() => setLang('en')}>
            EN
          </button>
          <button className={lang === 'ta' ? 'is-on' : ''} onClick={() => setLang('ta')}>
            தமிழ்
          </button>
        </div>
        <a className="btn" href={waLink()} target="_blank" rel="noreferrer">
          {t.nav.apply}
        </a>
        <button className="menu-btn" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}
