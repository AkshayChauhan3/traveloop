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
    glow: 'glow-border-cyan',
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
    color: 'rose',
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
  brand: { icon: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  rose: { icon: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
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
                className={`glass-card p-6 relative overflow-hidden group ${
                  feature.highlight ? `${feature.glow} scale-[1.02]` : 'border border-white/5'
                }`}
              >
                {/* Background glow for highlight cards */}
                {feature.highlight && (
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      background: feature.color === 'brand'
                        ? 'radial-gradient(circle at 50% 0%, rgba(124,58,237,1), transparent 70%)'
                        : 'radial-gradient(circle at 50% 0%, rgba(245,158,11,1), transparent 70%)',
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
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>

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

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '50K+', label: 'Trips Planned' },
            { value: '120+', label: 'Destinations' },
            { value: '12K+', label: 'Happy Travelers' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
