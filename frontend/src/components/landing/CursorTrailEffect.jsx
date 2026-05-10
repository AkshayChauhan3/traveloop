import { useEffect, useRef } from 'react'

const IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
]

// Slightly varied sizes — all landscape/portrait mix but consistent
const SHAPES = [
  { w: 152, h: 108 },
  { w: 130, h: 165 },
  { w: 168, h: 112 },
  { w: 140, h: 140 },
]

let _imgIdx = 0
let _count  = 0
const MAX   = 6  // keep max 6 visible cards at once — prevents clutter

// Minimum distance between consecutive spawn origins to prevent clustering
const MIN_SPAWN_GAP = 80  // px

let _css = false
function injectCSS() {
  if (_css) return; _css = true
  const s = document.createElement('style')
  s.textContent = `
    /* ─── Trail card ─── */
    .tl {
      position: fixed;
      pointer-events: none;
      z-index: 4;              /* BELOW hero text which sits at z-10 */
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.85);
      box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08);
      opacity: 0;
      will-change: opacity, transform;
      transition: opacity 0.3s ease-out;
    }
    .tl img {
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      pointer-events: none; user-select: none;
      -webkit-user-drag: none;
    }
    /* Smooth overlay on card */
    .tl::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(76,175,80,0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    /* Fade in */
    .tl-in  { opacity: 0.82 !important; }

    /* Fade out — slightly longer for elegance */
    .tl-out {
      opacity: 0 !important;
      transform: var(--tl-base-transform) translateY(-18px) scale(0.96) !important;
      transition: opacity 0.55s ease-in, transform 0.55s ease-in !important;
    }

    /* ─── Custom cursor ring ─── */
    @keyframes cRing {
      0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: .35; }
      50%      { transform: translate(-50%,-50%) scale(1.22); opacity: .75; }
    }
    .tl-ring {
      position: fixed; pointer-events: none; z-index: 9999;
      border-radius: 50%;
      border: 1.5px solid rgba(76,175,80,0.6);
      width: 34px; height: 34px;
      animation: cRing 1.8s ease-in-out infinite;
      will-change: transform, opacity;
    }
    .tl-dot {
      position: fixed; pointer-events: none; z-index: 9999;
      border-radius: 50%;
      width: 7px; height: 7px;
      background: #4CAF50;
      transform: translate(-50%,-50%);
      box-shadow: 0 0 8px 2px rgba(76,175,80,0.35);
    }
  `
  document.head.appendChild(s)
}

function spawn(x, y, container) {
  if (_count >= MAX) return
  _count++

  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  const src   = IMAGES[_imgIdx % IMAGES.length]; _imgIdx++

  // Controlled scatter: spread cards around cursor but with limits so
  // they don't cluster on top of each other — offset is in a circular zone
  const angle = Math.random() * Math.PI * 2
  const dist  = 60 + Math.random() * 90     // 60–150 px from cursor
  const ox    = Math.cos(angle) * dist
  const oy    = Math.sin(angle) * dist * 0.65  // slightly less vertical scatter

  // Gentle tilt — max ±14 degrees
  const rot = (Math.random() - 0.5) * 28
  const baseTransform = `translate(-50%,-50%) rotate(${rot}deg)`

  const el = document.createElement('div')
  el.className = 'tl'
  el.style.left   = (x + ox) + 'px'
  el.style.top    = (y + oy) + 'px'
  el.style.width  = shape.w + 'px'
  el.style.height = shape.h + 'px'
  el.style.transform = baseTransform
  el.style.setProperty('--tl-base-transform', baseTransform)

  const img = document.createElement('img')
  img.src = src; img.alt = 'travel destination'
  el.appendChild(img)

  if (container) container.appendChild(el)

  // Fade in on next paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('tl-in'))
  })

  // Hold time: 600–1000 ms, then fade out
  const hold = 600 + Math.random() * 400
  setTimeout(() => {
    el.classList.remove('tl-in')
    el.classList.add('tl-out')
    setTimeout(() => { el.remove(); _count-- }, 600)
  }, hold)
}

export default function CursorTrailEffect() {
  const containerRef  = useRef(null)
  const ringRef       = useRef(null)
  const dotRef        = useRef(null)
  const posRef        = useRef({ x: -300, y: -300 })
  const lastSpawnRef  = useRef({ x: -300, y: -300 })
  const isScrolledRef = useRef(false)

  // ── Scroll detection: disable trail & cursor past hero ──────────────────
  useEffect(() => {
    injectCSS()

    const handleScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8
      isScrolledRef.current = past

      if (past) {
        document.body.classList.remove('cursor-hidden')
        if (ringRef.current) ringRef.current.style.display = 'none'
        if (dotRef.current)  dotRef.current.style.display  = 'none'
      } else {
        document.body.classList.add('cursor-hidden')
        if (ringRef.current) ringRef.current.style.display = 'block'
        if (dotRef.current)  dotRef.current.style.display  = 'block'
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('cursor-hidden')
    }
  }, [])

  // ── rAF loop: cursor movement + spawn ───────────────────────────────────
  useEffect(() => {
    let raf

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const { x, y } = posRef.current

      if (ringRef.current) { ringRef.current.style.left = x + 'px'; ringRef.current.style.top = y + 'px' }
      if (dotRef.current)  { dotRef.current.style.left  = x + 'px'; dotRef.current.style.top  = y + 'px' }

      if (!isScrolledRef.current) {
        const dx = x - lastSpawnRef.current.x
        const dy = y - lastSpawnRef.current.y
        // Spawn only when cursor moved MIN_SPAWN_GAP pixels from last spawn
        if (dx * dx + dy * dy >= MIN_SPAWN_GAP * MIN_SPAWN_GAP) {
          lastSpawnRef.current = { x, y }
          spawn(x, y, containerRef.current)
        }
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    // z-index 4 — sits above background blobs (z-0) but below hero text (z-10)
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
      <div ref={ringRef} className="tl-ring" style={{ left: -300, top: -300 }} />
      <div ref={dotRef}  className="tl-dot"  style={{ left: -300, top: -300 }} />
    </div>
  )
}
