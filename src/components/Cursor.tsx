import { useEffect, useRef } from 'react'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    let x = 0
    let y = 0
    let rx = 0
    let ry = 0
    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      const target = e.target as HTMLElement | null
      const hover = Boolean(target && target.closest('a, button, summary, input, select, textarea'))
      ring.current?.classList.toggle('is-hover', hover)
    }
    window.addEventListener('mousemove', onMove)
    let frame = 0
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
