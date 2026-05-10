import { motion } from 'framer-motion'
import { Sparkles, DollarSign, Map, Users, Zap, Globe, PackageCheck, BookOpen } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Trip Optimizer',
    description: 'Let our AI analyze your budget, interests, and mood to generate a fully optimized travel itinerary in seconds.',
    color: 'brand',
    badge: 'AI-Powered',
    highlight: true,
    glow: 'glow-border',
  },
  {
    icon: DollarSign,
    title: 'Smart Budget Warnings',
    description: 'Real-time budget tracking with intelligent warnings when spending exceeds limits, with cheaper alternatives suggested.',
    color: 'amber',
    badge: 'Smart',
    highlight: true,
    glow: 'glow-border-amber',
  },
  {
    icon: Map,
    title: 'Day-wise Itinerary Builder',
    description: 'Drag and drop activities, add cities, set timings, and build your perfect travel schedule effortlessly.',
    color: 'cyan',
    badge: null,
    highlight: false,
    glow: '',
  },
  {
    icon: Globe,
    title: 'Destination Explorer',
    description: 'Discover thousands of destinations, filter by mood, budget, and region, and add them to your trip instantly.',
    color: 'emerald',
    badge: null,
    highlight: false,
    glow: '',
  },
  {
    icon: Users,
    title: 'Community Trips',
    description: 'Share your trips with the world, get inspired by fellow travelers, and copy great itineraries with one click.',
    color: 'leaf',
    badge: null,
    highlight: false,
    glow: '',
  },
  {
    icon: PackageCheck,
    title: 'Packing Checklist',
    description: 'Never forget essentials again. Organize your packing list by category and track completion with visual progress.',
    color: 'amber',
    badge: null,
    highlight: false,
    glow: '',
  },
]

const colorMap = {
  brand:   { icon: 'text-brand-500', bg: 'bg-leaf-light',   border: 'border-brand-200' },
  amber:   { icon: 'text-amber-500', bg: 'bg-amber-50',     border: 'border-amber-200' },
  cyan:    { icon: 'text-cyan-600',  bg: 'bg-cyan-50',      border: 'border-cyan-200' },
  emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  leaf:    { icon: 'text-brand-600', bg: 'bg-leaf-soft',    border: 'border-brand-300' },
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

export default function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#ffffff' }}>
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge badge-purple mb-4 inline-block">Features</span>
          <h2 className="section-title">
            Everything you need to{' '}
            <span className="gradient-text">plan the perfect trip</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From AI-powered suggestions to real-time budget tracking — Traveloop has all the tools to make travel planning effortless.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            const c = colorMap[feature.color]
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`glass-card p-6 relative overflow-hidden group transition-all ${
                  feature.highlight ? `${feature.glow}` : ''
                }`}
              >
                {/* Subtle background tint for highlighted cards */}
                {feature.highlight && (
                  <div
                    className="absolute inset-0 opacity-30 rounded-2xl"
                    style={{
                      background: feature.color === 'brand'
                        ? 'linear-gradient(135deg, #E8F5E9 0%, transparent 70%)'
                        : 'linear-gradient(135deg, #fef9c3 0%, transparent 70%)',
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${c.icon}`} />
                    </div>
                    {feature.badge && (
                      <span className={feature.color === 'brand' ? 'badge badge-purple' : 'badge badge-amber'}>
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>

                  {/* Hover arrow */}
                  <div className={`mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity ${c.icon}`}>
                    <span>Learn more</span>
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Product benefit highlights — honest, no fake numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { emoji: '🆓', label: 'Free to Start',       sub: 'No credit card needed' },
            { emoji: '🤖', label: 'AI Trip Optimizer',    sub: 'Generate plans in seconds' },
            { emoji: '💰', label: 'Budget-Smart',         sub: 'Real-time spending alerts' },
            { emoji: '🔗', label: 'Easy Sharing',         sub: 'Share trips with anyone' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-6 text-center">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="font-bold text-slate-800 text-sm mb-0.5">{item.label}</div>
              <div className="text-slate-500 text-xs">{item.sub}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
