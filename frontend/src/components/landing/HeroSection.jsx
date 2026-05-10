import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles, Zap, Star } from 'lucide-react'

// Floating particles
const Particle = ({ x, y, size, delay, color }) => (
  <motion.div
    className="absolute rounded-full opacity-20"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
    animate={{
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      opacity: [0.1, 0.3, 0.1],
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
  color: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#06b6d4' : '#f59e0b',
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
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.6) 0%, rgba(109,40,217,0.3) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.6) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.5) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Floating image cards - decorative */}
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
              className="absolute w-40 h-28 rounded-2xl overflow-hidden shadow-2xl"
              style={{ ...pos, border: '1px solid rgba(255,255,255,0.1)' }}
              animate={{ y: [0, -12, 0], rotate: [pos.rotate, pos.rotate + 2, pos.rotate] }}
              transition={{ duration: 5 + i * 1.5, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={img} alt="destination" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-slate-300">AI-Powered Travel Planning</span>
          <span className="badge badge-purple">New</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tight leading-none"
        >
          <span className="text-white">Travel</span>
          <span className="gradient-text">oop</span>
        </motion.h1>

        {/* Sub heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed"
        >
          Plan your travel itinerary easily with{' '}
          <span className="text-brand-400 font-semibold">smart trip planning</span>,{' '}
          <span className="text-accent-cyan font-semibold">budget tracking</span>,{' '}
          destination discovery, and{' '}
          <span className="text-accent-amber font-semibold">AI-powered travel suggestions</span>.
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
          className="flex items-center justify-center gap-6 mt-12 text-slate-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D'].map((l) => (
                <div key={l} className="w-7 h-7 rounded-full border-2 border-surface-50 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {l}
                </div>
              ))}
            </div>
            <span>12,000+ travelers</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 text-accent-amber fill-accent-amber" />
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
          className="flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-brand-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
