import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { copy, Lang } from './i18n'

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (typeof copy)[Lang]
}

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => {
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'
  }, [lang])
  const value = useMemo(() => ({ lang, setLang, t: copy[lang] }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
