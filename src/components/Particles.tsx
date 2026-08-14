import { useEffect, useRef } from 'react'

const GLYPHS = ['{', '}', '</>', 'def', '=>', 'SQL', '01', 'λ', '[]', 'fn']

export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let width = 0
    let height = 0
    const mouse = { x: -9999, y: -9999 }
    type P = { x: number; y: number; vx: number; vy: number; g: string; s: number }
    let particles: P[] = []

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      const count = Math.min(48, Math.floor(width / 36))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        g: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        s: 11 + Math.random() * 10,
      }))
    }
    resize()
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)

    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p, i) => {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 140) {
          p.vx += (dx / dist) * 0.08
          p.vy += (dy / dist) * 0.08
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.font = `${p.s}px ui-monospace, monospace`
        ctx.fillStyle = 'rgba(125, 211, 252, 0.28)'
        ctx.fillText(p.g, p.x, p.y)

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 110) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - d / 110)})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      })
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.7 }}
    />
  )
}
