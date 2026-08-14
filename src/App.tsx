import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './Language'
import { useLenis } from './hooks/useLenis'
import { Cursor } from './components/Cursor'
import { Particles } from './components/Particles'
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Marquee, Stats } from './components/Marquee'
import { Curriculum, Journey, Mission } from './components/Sections'
import { FAQ, Scholarship, Why } from './components/Scholarship'
import { Contact, Footer } from './components/Contact'
import { waLink } from './i18n'

function Site() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])
  useLenis(ready)

  return (
    <>
      <Cursor />
      <Particles />
      <div className="noise" />
      <AnimatePresence>{!ready && <Preloader key="boot" onDone={onDone} />}</AnimatePresence>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Mission />
        <Curriculum />
        <Journey />
        <Scholarship />
        <Why />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <a
        className="wa-float"
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp Cverse"
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.01 3C9.4 3 4 8.4 4 15.02c0 2.64.86 5.08 2.32 7.06L4.7 29l7.12-1.86A12 12 0 0 0 16 27c6.62 0 12-5.4 12-12S22.63 3 16.01 3zm6.94 16.9c-.29.82-1.44 1.5-2.36 1.7-.62.13-1.43.24-4.16-.9-3.5-1.46-5.74-5.04-5.91-5.27-.17-.23-1.4-1.86-1.4-3.55s.88-2.52 1.2-2.86c.29-.32.64-.4.86-.4h.62c.2 0 .46-.08.72.55.29.7.97 2.38 1.06 2.55.08.17.14.38.03.6-.1.23-.17.38-.34.58-.17.2-.36.45-.51.6-.17.17-.35.35-.15.68.2.32.88 1.45 1.9 2.35 1.3 1.15 2.4 1.51 2.73 1.68.34.17.53.14.73-.08.2-.23.85-.99 1.08-1.33.23-.34.46-.28.77-.17.32.11 2.01.95 2.36 1.12.34.17.58.26.66.4.08.14.08.82-.21 1.64z" />
        </svg>
      </a>
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  )
}
