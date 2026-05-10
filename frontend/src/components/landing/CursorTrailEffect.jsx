import { useEffect, useRef } from 'react'

const IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
]

const SHAPES = [
  { w: 160, h: 110 },
  { w: 128, h: 160 },
  { w: 175, h: 116 },
  { w: 145, h: 145 },
]

let _imgIdx = 0
let _count   = 0
const MAX    = 8

/* ── inject styles once ─────────────────────────────────────────────────── */
let _css = false
function injectCSS() {
  if (_css) return; _css = true
  const s = document.createElement('style')
  s.textContent = `
    .tl {
      position: fixed;
      pointer-events: none;
      z-index: 2;
      border-radius: 14px;
      overflow: hidden;
      border: 1.5px solid rgba(255,255,255,0.18);
      box-shadow: 0 10px 32px rgba(0,0,0,0.55);
      opacity: 0;
      will-change: opacity;
    }
    .tl img {
      width:100%; height:100%;
      object-fit:cover; display:block;
      pointer-events:none; user-select:none;
      -webkit-user-drag:none;
    }
    .tl-in  { transition: opacity 0.12s ease-out; opacity: 0.88 !important; }
    .tl-out { transition: opacity 0.32s ease-in;  opacity: 0    !important; }

    /* cursor ring pulse */
    @keyframes cRing {
      0%,100% { transform:translate(-50%,-50%) scale(1);   opacity:.45; }
      50%     { transform:translate(-50%,-50%) scale(1.28); opacity:.9;  }
    }
    .tl-ring {
      position:fixed; pointer-events:none; z-index:9999;
      border-radius:50%;
      border: 1.5px solid rgba(167,139,250,0.7);
      width:36px; height:36px;
      animation: cRing 1.7s ease-in-out infinite;
      will-change: transform, opacity;
    }
    .tl-dot {
      position:fixed; pointer-events:none; z-index:9999;
      border-radius:50%;
      width:8px; height:8px;
      background:#a78bfa;
      transform:translate(-50%,-50%);
      box-shadow: 0 0 10px 3px rgba(167,139,250,0.75);
    }
  `
  document.head.appendChild(s)
}

/* ── spawn one card at (x,y) ─────────────────────────────────────────────── */
function spawn(x, y) {
  if (_count >= MAX) return
  _count++

  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  const src   = IMAGES[_imgIdx % IMAGES.length]; _imgIdx++

  // Moderate scatter so it feels "around the cursor path"
  const ox  = (Math.random() - 0.5) * 180
  const oy  = (Math.random() - 0.5) * 130
  const rot = (Math.random() - 0.5) * 24

  const el = document.createElement('div')
  el.className = 'tl'
  el.style.left    = (x + ox) + 'px'
  el.style.top     = (y + oy) + 'px'
  el.style.width   = shape.w + 'px'
  el.style.height  = shape.h + 'px'
  // set rotation as static transform — never changes, so no keyframe issues
  el.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`

  const img = document.createElement('img')
  img.src = src; img.alt = ''
  el.appendChild(img)
  document.body.appendChild(el)

  // Fade IN — one rAF so browser has painted the element first
  requestAnimationFrame(() => el.classList.add('tl-in'))

  // Fade OUT after hold time
  const hold = 900 + Math.random() * 200
  setTimeout(() => {
    el.classList.remove('tl-in')
    el.classList.add('tl-out')
    // remove from DOM after transition ends
    setTimeout(() => { el.remove(); _count-- }, 340)
  }, hold)
}

/* ── component ───────────────────────────────────────────────────────────── */
export default function CursorTrailEffect() {
  const ringRef = useRef(null)
  const dotRef  = useRef(null)
  const posRef  = useRef({ x: -300, y: -300 })
  const lastRef = useRef({ x: -300, y: -300 })
  const isScrolledRef = useRef(false)

  useEffect(() => {
    injectCSS()
    
    // Check scroll position to determine if trail should be active
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      isScrolledRef.current = scrolled
      
      if (scrolled) {
        document.body.classList.remove('cursor-hidden')
        if (ringRef.current) ringRef.current.style.display = 'none'
        if (dotRef.current) dotRef.current.style.display = 'none'
      } else {
        document.body.classList.add('cursor-hidden')
        if (ringRef.current) ringRef.current.style.display = 'block'
        if (dotRef.current) dotRef.current.style.display = 'block'
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('cursor-hidden')
    }
  }, [])

  useEffect(() => {
    let raf

    /* move listener: captures raw mouse position */
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    /* rAF loop: smoothly moves cursor elements & checks spawn distance */
    const tick = () => {
      const { x, y } = posRef.current

      // Always update cursor position behind the scenes
      if (ringRef.current) {
        ringRef.current.style.left = x + 'px'
        ringRef.current.style.top  = y + 'px'
      }
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px'
        dotRef.current.style.top  = y + 'px'
      }

      // Only spawn images if we are NOT scrolled down
      if (!isScrolledRef.current) {
        const dx = x - lastRef.current.x
        const dy = y - lastRef.current.y
        if (dx * dx + dy * dy >= 55 * 55) {        // spawn every ~55px
          lastRef.current = { x, y }
          spawn(x, y)
        }
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={ringRef} className="tl-ring" style={{ left: -300, top: -300 }} />
      <div ref={dotRef}  className="tl-dot"  style={{ left: -300, top: -300 }} />
    </>
  )
}
