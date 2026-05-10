import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Zap, MapPin, Compass } from 'lucide-react'

// Floating particles — subtle green dust
const Particle = ({ x, y, size, delay, color }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, opacity: 0.25 }}
    animate={{ y: [-8, 8, -8], x: [-4, 4, -4], opacity: [0.1, 0.3, 0.1] }}
    transition={{ duration: 4 + Math.random() * 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
)

const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 5,
  delay: Math.random() * 4,
  color: i % 2 === 0 ? '#4CAF50' : '#f97316',
}))

// Static floating image cards — decorative, positioned at the sides
const CARD_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', top: '12%', left: '4%',  rotate: -10, w: 152, h: 108 },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', top: '58%', left: '2%',  rotate:   7, w: 134, h: 170 },
  { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80', top:  '9%', right: '4%', rotate:  10, w: 158, h: 106 },
  { src: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&q=80', top: '63%', right: '3%', rotate:  -9, w: 138, h: 154 },
]

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(160deg, #FAFAF7 0%, #F0FAF0 40%, #F8FAF5 100%)' }}
    >
      {/* ── Layer 1: Background blobs ── z-0 */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(76,175,80,0.13) 0%, rgba(76,175,80,0.04) 40%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      {/* ── Layer 2: Floating particles ── z-[1] */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {particles.map((p) => <Particle key={p.id} {...p} />)}
      </div>

      {/* ── Layer 3: Static floating image cards (sides only) ── z-[2] */}
      {/* These are decorative and positioned away from the text center */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-[2] pointer-events-none hidden lg:block"
      >
        {CARD_IMAGES.map((card, i) => {
          // Build positioning style — left OR right based on card config
          const posStyle = {
            position: 'absolute',
            top: card.top,
            ...(card.left  ? { left:  card.left  } : {}),
            ...(card.right ? { right: card.right } : {}),
          }
          return (
            <motion.div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                ...posStyle,
                width: card.w,
                height: card.h,
                border: '2.5px solid rgba(255,255,255,0.9)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(76,175,80,0.1)',
                rotate: card.rotate,
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5 + i * 1.5, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={card.src} alt="destination" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              {/* Small destination pin badge */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                <MapPin className="w-2.5 h-2.5 text-brand-600" />
                <span className="text-[9px] font-semibold text-slate-700">Explore</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Layer 4: Cursor trail spawns here (z-[4] in CursorTrailEffect.jsx) ── */}

      {/* ── Layer 5: Main hero text ── z-[10] — always on top of trail */}
      <motion.div
        style={{ opacity }}
        className="relative z-[10] text-center px-4 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 glass glow-border px-4 py-2 rounded-full mb-8 text-sm"
        >
          <Compass className="w-4 h-4 text-brand-500" />
          <span className="text-slate-600">AI-Powered Travel Planning</span>
          <span className="badge badge-purple">New</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tight leading-none"
        >
          <span style={{ color: '#1e2d1f' }}>Travel</span>
          <span className="gradient-text">oop</span>
        </motion.h1>

        {/* Sub-heading — orange-only highlights, no multi-color */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed"
          style={{ color: '#4a6b4c' }}
        >
          Plan your travel itinerary easily with{' '}
          <span style={{ color: '#f97316', fontWeight: 600 }}>smart trip planning</span>,{' '}
          <span style={{ color: '#f97316', fontWeight: 600 }}>budget tracking</span>,{' '}
          destination discovery, and{' '}
          <span style={{ color: '#f97316', fontWeight: 600 }}>AI-powered travel suggestions</span>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-slate-500 mb-10 text-base max-w-2xl mx-auto"
        >
          Traveloop helps you create organized, personalized, and visually beautiful travel plans in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="hero-start-planning"
              className="btn-primary text-base px-8 py-4 flex items-center gap-2 rounded-2xl"
            >
              <Zap className="w-5 h-5" />
              Start Planning
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link to="/community">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="hero-explore-trips"
              className="btn-secondary text-base px-8 py-4 flex items-center gap-2 rounded-2xl"
            >
              <Play className="w-5 h-5" />
              Explore Trips
            </motion.button>
          </Link>
        </motion.div>

        {/* Minimal trust line — no fake numbers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
            Free to get started
          </span>
          <span className="hidden sm:block w-px h-4 bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            AI trip optimizer included
          </span>
          <span className="hidden sm:block w-px h-4 bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
            No credit card required
          </span>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── z-[10] */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10]"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
          style={{ color: '#4a6b4c' }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border flex items-start justify-center p-1" style={{ borderColor: '#bce8bc' }}>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-brand-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
