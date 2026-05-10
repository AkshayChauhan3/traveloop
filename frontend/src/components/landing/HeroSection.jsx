import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles, Zap, Star, Leaf } from 'lucide-react'

// Floating particles
const Particle = ({ x, y, size, delay, color }) => (
  <motion.div
    className="absolute rounded-full opacity-30"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
    animate={{
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      opacity: [0.15, 0.35, 0.15],
    }}
    transition={{ duration: 4 + Math.random() * 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
)

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 6,
  delay: Math.random() * 4,
  color: i % 3 === 0 ? '#4CAF50' : i % 3 === 1 ? '#6FBF73' : '#a8d5a9',
}))

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&q=80',
]

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(160deg, #FAFAF7 0%, #F0FAF0 40%, #F8FAF5 100%)' }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(76,175,80,0.12) 0%, rgba(76,175,80,0.04) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(110,191,115,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(76,175,80,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Floating image cards */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none hidden lg:block"
      >
        {HERO_IMAGES.map((img, i) => {
          const positions = [
            { top: '15%', left: '5%', rotate: -12 },
            { top: '60%', left: '3%', rotate: 8 },
            { top: '10%', right: '5%', rotate: 10 },
            { top: '65%', right: '4%', rotate: -8 },
          ]
          const pos = positions[i]
          return (
            <motion.div
              key={i}
              className="absolute w-40 h-28 rounded-2xl overflow-hidden shadow-leaf"
              style={{ ...pos, border: '2px solid rgba(255,255,255,0.8)' }}
              animate={{ y: [0, -12, 0], rotate: [pos.rotate, pos.rotate + 2, pos.rotate] }}
              transition={{ duration: 5 + i * 1.5, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={img} alt="destination" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 glass glow-border px-4 py-2 rounded-full mb-8 text-sm"
        >
          <Leaf className="w-4 h-4 text-brand-500" />
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

        {/* Sub heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed"
          style={{ color: '#4a6b4c' }}
        >
          Plan your travel itinerary easily with{' '}
          <span className="text-brand-600 font-semibold">smart trip planning</span>,{' '}
          <span className="text-cyan-600 font-semibold">budget tracking</span>,{' '}
          destination discovery, and{' '}
          <span className="text-amber-600 font-semibold">AI-powered travel suggestions</span>.
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

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-6 mt-12 text-sm"
          style={{ color: '#4a6b4c' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D'].map((l) => (
                <div key={l} className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {l}
                </div>
              ))}
            </div>
            <span>12,000+ travelers</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            <span>4.9/5</span>
          </div>
          <span className="hidden sm:block">50K+ trips planned</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
