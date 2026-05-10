import { motion } from 'framer-motion'
import { Plus, MapPin, DollarSign, Share2, Sparkles, CheckCircle2, Brain } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Plus,
    title: 'Create a Trip',
    description: 'Start by naming your trip, setting your dates, and picking your travel style — adventure, relaxation, culture, and more.',
    color: 'brand',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Add Destinations & Activities',
    description: 'Browse thousands of destinations, add cities day by day, and populate each day with activities using our intuitive builder.',
    color: 'cyan',
  },
  {
    number: '03',
    icon: DollarSign,
    title: 'Track Your Budget',
    description: 'Monitor spending in real time. Smart budget warnings alert you before you overspend, and suggest cheaper alternatives.',
    color: 'amber',
  },
  {
    number: '04',
    icon: Share2,
    title: 'Share or Save Your Itinerary',
    description: 'Export a beautiful itinerary, share it with travel companions, or keep it private in your personal trip library.',
    color: 'emerald',
  },
]

const colorMap = {
  brand:   { icon: 'text-brand-500', bg: 'bg-leaf-light', border: 'border-brand-300', num: 'text-brand-400' },
  cyan:    { icon: 'text-cyan-600',  bg: 'bg-cyan-50',    border: 'border-cyan-200',   num: 'text-cyan-400' },
  amber:   { icon: 'text-amber-600', bg: 'bg-amber-50',   border: 'border-amber-200',  num: 'text-amber-400' },
  emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', num: 'text-emerald-500' },
}

const tools = [
  { icon: Brain,         label: 'AI Trip Optimizer',      desc: 'Generate a full itinerary from your mood & budget in seconds.' },
  { icon: DollarSign,   label: 'Smart Budget Warnings',   desc: 'Never overspend — real-time alerts with saving suggestions.' },
  { icon: CheckCircle2, label: 'Travel Checklist',        desc: 'Category-wise packing list so you never forget an essential.' },
  { icon: Sparkles,     label: 'Notes & Trip Planner',    desc: 'Attach notes, hotel contacts, and local tips to each trip.' },
]

export default function HowItWorksSection() {
  return (
    <>
      {/* ─── How It Works ─── */}
      <section className="relative py-24 overflow-hidden" style={{ background: '#F8FAF5' }}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-purple mb-4 inline-block">How It Works</span>
            <h2 className="section-title">
              Plan smarter in{' '}
              <span className="gradient-text">4 simple steps</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              From first inspiration to a fully packed itinerary — Traveloop makes every step easy and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              const c = colorMap[step.color]
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="glass-card p-6 relative flex flex-col"
                >
                  <div className={`text-5xl font-black mb-4 ${c.num} opacity-30 leading-none`}>{step.number}</div>
                  <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Tools ─── */}
      <section className="py-24" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge badge-emerald mb-4 inline-block">Featured Tools</span>
            <h2 className="section-title">
              Everything in{' '}
              <span className="gradient-text">one place</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Powerful tools designed to make travel planning feel effortless, organized, and even fun.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.map((tool, i) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass-card p-6 text-center group hover:border-brand-300 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-leaf-light border border-brand-200 flex items-center justify-center mx-auto mb-4 group-hover:bg-leaf-soft transition-colors">
                    <Icon className="w-7 h-7 text-brand-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{tool.label}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{tool.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
