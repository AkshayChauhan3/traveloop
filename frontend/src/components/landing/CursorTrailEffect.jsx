import { useEffect, useRef } from 'react'

const IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=300&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=80',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&q=80',
  'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=300&q=80',
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300&q=80',
]

// Card dimensions — bigger cards for visual impact
const CARD_W = 200
const CARD_H = 140

// How far cursor must travel before spawning the next card (cart spacing)
const SPAWN_DIST = 55    // px — tight train cart spacing

// Max "carts" visible at one time
const MAX_CARDS = 10

// Hold time before fade starts (ms) — slightly slower, cards linger a bit
const HOLD_MS = 450

// Fade-out duration (ms) — fast!
const FADE_MS = 200

let _imgIdx = 0

let _cssInjected = false
function injectCSS() {
  if (_cssInjected) return
  _cssInjected = true

  const s = document.createElement('style')
  s.textContent = `
    /* ── Trail card ─────────────────────────────────────── */
    .tr-card {
      position: fixed;
      pointer-events: none;
      z-index: 4;                  /* behind hero text (z-10) */
      width:  ${CARD_W}px;
      height: ${CARD_H}px;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.9);
      box-shadow: 0 4px 18px rgba(0,0,0,0.18);
      /* positioned by left/top — centred on spawn point via transform */
      transform: translate(-50%, -50%);
      opacity: 0;
      /* fade-in */
      transition: opacity ${FADE_MS * 0.8}ms ease-out;
      will-change: opacity;
    }
    .tr-card img {
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      pointer-events: none; user-select: none;
      -webkit-user-drag: none;
    }
    /* small green tint overlay */
    .tr-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(76,175,80,0.07) 0%, transparent 60%);
    }
    /* active = fully visible */
    .tr-card.tr-in  { opacity: 0.85; }
    /* fading out */
    .tr-card.tr-out {
      opacity: 0 !important;
      transition: opacity ${FADE_MS}ms ease-in !important;
    }

    /* ── Custom cursor ───────────────────────────────────── */
    @keyframes trRing {
      0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: .4; }
      50%      { transform: translate(-50%,-50%) scale(1.18); opacity: .8; }
    }
    .tr-ring {
      position: fixed; pointer-events: none; z-index: 9999;
      width: 32px; height: 32px; border-radius: 50%;
      border: 1.5px solid rgba(76,175,80,0.65);
      animation: trRing 1.6s ease-in-out infinite;
      will-change: transform, opacity;
    }
    .tr-dot {
      position: fixed; pointer-events: none; z-index: 9999;
      width: 6px; height: 6px; border-radius: 50%;
      background: #4CAF50;
      transform: translate(-50%,-50%);
      box-shadow: 0 0 6px 2px rgba(76,175,80,0.4);
    }
  `
  document.head.appendChild(s)
}

/* Spawn one card at exact (x, y) — the cursor's historical position */
let _activeCount = 0

function spawnCard(x, y, container) {
  if (_activeCount >= MAX_CARDS) return
  _activeCount++

  const src = IMAGES[_imgIdx % IMAGES.length]
  _imgIdx++

  const card = document.createElement('div')
  card.className = 'tr-card'
  card.style.left = x + 'px'
  card.style.top  = y + 'px'

  const img = document.createElement('img')
  img.src = src
  img.alt = 'travel'
  card.appendChild(img)

  container.appendChild(card)

  // Trigger fade-in on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => card.classList.add('tr-in'))
  })

  // After HOLD_MS, fast fade-out then remove
  setTimeout(() => {
    card.classList.remove('tr-in')
    card.classList.add('tr-out')
    setTimeout(() => {
      card.remove()
      _activeCount--
    }, FADE_MS)
  }, HOLD_MS)
}

export default function CursorTrailEffect() {
  const containerRef  = useRef(null)
  const ringRef       = useRef(null)
  const dotRef        = useRef(null)

  // Raw cursor position (updated every mousemove)
  const cursorRef     = useRef({ x: -500, y: -500 })
  // Last position where we spawned a card
  const lastSpawnRef  = useRef({ x: -500, y: -500 })

  const isScrolledRef = useRef(false)

  /* ── Scroll: disable trail past hero ─────────────────── */
  useEffect(() => {
    injectCSS()

    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8
      isScrolledRef.current = past
      const display = past ? 'none' : 'block'
      if (ringRef.current) ringRef.current.style.display = display
      if (dotRef.current)  dotRef.current.style.display  = display
      document.body.classList.toggle('cursor-hidden', !past)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.classList.remove('cursor-hidden')
    }
  }, [])

  /* ── rAF loop: move cursor visuals + spawn trail ─────── */
  useEffect(() => {
    let raf

    const onMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const { x, y } = cursorRef.current

      // Move cursor ring & dot
      if (ringRef.current) { ringRef.current.style.left = x + 'px'; ringRef.current.style.top = y + 'px' }
      if (dotRef.current)  { dotRef.current.style.left  = x + 'px'; dotRef.current.style.top  = y + 'px' }

      // Spawn trail card only in hero zone and when moved far enough
      if (!isScrolledRef.current) {
        const dx = x - lastSpawnRef.current.x
        const dy = y - lastSpawnRef.current.y
        const dist2 = dx * dx + dy * dy

        if (dist2 >= SPAWN_DIST * SPAWN_DIST) {
          // Spawn at the LAST position (behind cursor) — train-cart effect
          // The card appears where the cursor WAS, not where it IS
          spawnCard(lastSpawnRef.current.x, lastSpawnRef.current.y, containerRef.current)
          lastSpawnRef.current = { x, y }
        }
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    /* z-index 4 — above bg (z-0) but below hero text (z-10) */
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 4, pointerEvents: 'none' }}
    >
      <div ref={ringRef} className="tr-ring" style={{ left: -500, top: -500 }} />
      <div ref={dotRef}  className="tr-dot"  style={{ left: -500, top: -500 }} />
    </div>
  )
}
