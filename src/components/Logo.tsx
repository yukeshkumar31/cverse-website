import { LogoMark } from './LogoMark'

export function Logo({ compact = true }: { compact?: boolean }) {
  return (
    <a href="#top" className="logo" aria-label="Cverse home">
      <LogoMark variant={compact ? 'wordmark' : 'monitor'} className="logo-mark" />
      <span className="logo-meta">
        <small>Let’s Fun-Code</small>
      </span>
    </a>
  )
}
