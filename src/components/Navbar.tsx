import { useEffect, useId, useRef, useState } from 'react'
import { Logo } from './Logo'
import { useI18n } from '../Language'
import { waLink } from '../i18n'

const SECTIONS = [
  { id: 'program', key: 'program' as const },
  { id: 'curriculum', key: 'curriculum' as const },
  { id: 'scholarship', key: 'scholarship' as const },
  { id: 'faq', key: 'faq' as const },
  { id: 'contact', key: 'contact' as const },
]

export function Navbar() {
  const { t, lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('program')
  const menuId = useId()
  const panelRef = useRef<HTMLElement>(null)

  const close = () => setOpen(false)

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!nodes.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.35, 0.6] }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className={`nav ${open ? 'is-open' : ''}`}>
      <Logo />
      <nav id={menuId} className="nav__links" ref={panelRef} aria-label="Primary">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'is-active' : undefined}
            aria-current={active === s.id ? 'location' : undefined}
            onClick={close}
          >
            {t.nav[s.key]}
          </a>
        ))}
        <a className="btn nav__apply-mobile" href={waLink()} target="_blank" rel="noopener noreferrer" onClick={close}>
          {t.nav.apply}
        </a>
      </nav>
      <div className="nav__right">
        <div className="lang" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === 'en' ? 'is-on' : ''}
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={lang === 'ta' ? 'is-on' : ''}
            aria-pressed={lang === 'ta'}
            onClick={() => setLang('ta')}
          >
            தமிழ்
          </button>
        </div>
        <a className="btn nav__apply-desktop" href={waLink()} target="_blank" rel="noopener noreferrer">
          {t.nav.apply}
        </a>
        <button
          className="menu-btn"
          type="button"
          aria-label={open ? t.nav.close : t.nav.menu}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && <button type="button" className="nav__backdrop" aria-label={t.nav.close} onClick={close} />}
    </header>
  )
}
