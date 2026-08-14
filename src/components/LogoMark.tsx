import { motion } from 'framer-motion'
import { useId } from 'react'

const NEON = '#3EC8FF'
const NEON_SOFT = '#7DDCFF'

const C_PATH =
  'M 248 18 H 44 A 22 22 0 0 0 22 40 V 52 A 22 22 0 0 0 44 74 H 248'

const VERSE = [
  'M 58 28 L 72 64 L 86 28',
  'M 116 28 H 96 V 64 H 116 M 96 46 H 112',
  'M 128 64 V 28 H 146 A 11 11 0 0 1 146 46 H 128 M 139 46 L 156 64',
  'M 186 32 Q 186 24 174 24 H 166 Q 158 24 158 32 Q 158 40 168 42 H 176 Q 186 44 186 54 Q 186 64 174 64 H 166 Q 158 64 158 56',
  'M 216 28 H 196 V 64 H 216 M 196 46 H 212',
]

type Variant = 'wordmark' | 'monitor'

type Props = {
  variant?: Variant
  animated?: boolean
  className?: string
}

export function LogoMark({ variant = 'wordmark', animated = false, className }: Props) {
  const rawId = useId().replace(/:/g, '')
  const glow = `glow-${rawId}`
  const screen = `screen-${rawId}`

  const wordmark = (
    <g
      className="logo-neon"
      filter={`url(#${glow})`}
      stroke={NEON}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <DrawPath d={C_PATH} animated={animated} delay={0.15} strokeWidth={9} />
      {VERSE.map((d, i) => (
        <DrawPath key={d} d={d} animated={animated} delay={0.45 + i * 0.12} strokeWidth={4.6} />
      ))}
    </g>
  )

  if (variant === 'wordmark') {
    return (
      <svg
        className={className}
        viewBox="0 0 270 92"
        fill="none"
        aria-hidden="true"
        role="img"
      >
        <defs>
          <NeonFilter id={glow} />
        </defs>
        {wordmark}
      </svg>
    )
  }

  return (
    <svg
      className={className}
      viewBox="0 0 360 292"
      fill="none"
      aria-hidden="true"
      role="img"
    >
      <defs>
        <NeonFilter id={glow} />
        <linearGradient id={screen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1a33" />
          <stop offset="100%" stopColor="#050914" />
        </linearGradient>
      </defs>

      <motion.g
        initial={animated ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <rect x="28" y="10" width="304" height="218" rx="26" fill="#1b2230" />
        <rect x="34" y="16" width="292" height="206" rx="22" fill="#121826" />
        <rect x="48" y="30" width="264" height="168" rx="12" fill={`url(#${screen})`} />
        <path d="M48 30 H312 V50 Q180 70 48 50 Z" fill="#3EC8FF" opacity="0.06" />
        <circle cx="180" cy="212" r="3" fill="#3EC8FF" opacity="0.85" />
        <path d="M148 228 H212 L228 264 H132 Z" fill="#2a3344" />
        <rect x="118" y="260" width="124" height="12" rx="6" fill="#3a4558" />
        <rect x="130" y="272" width="100" height="6" rx="3" fill="#252c3a" />
      </motion.g>

      <g transform="translate(56 76) scale(0.9)">{wordmark}</g>
    </svg>
  )
}

function DrawPath({
  d,
  animated,
  delay,
  strokeWidth,
}: {
  d: string
  animated: boolean
  delay: number
  strokeWidth: number
}) {
  if (!animated) {
    return <path d={d} strokeWidth={strokeWidth} />
  }
  return (
    <motion.path
      d={d}
      strokeWidth={strokeWidth}
      initial={{ pathLength: 0, opacity: 0.2 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

function NeonFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="2.4" result="blur" />
      <feFlood floodColor={NEON_SOFT} floodOpacity="0.85" />
      <feComposite in2="blur" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}
