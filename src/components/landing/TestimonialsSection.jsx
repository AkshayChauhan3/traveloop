import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Mehta',
    role: 'Solo Traveler',
    avatar: 'P',
    color: 'from-brand-400 to-brand-600',
    rating: 5,
    text: 'Traveloop completely changed how I plan trips. The AI Optimizer gave me a perfect Bali itinerary in under 30 seconds. Mind blown!',
    trip: 'Bali, Indonesia',
  },
  {
    name: 'Arjun Sharma',
    role: 'Adventure Seeker',
    avatar: 'A',
    color: 'from-cyan-400 to-brand-500',
    rating: 5,
    text: 'The budget warning system saved my Himalayan trek. It flagged that Day 4 was overspent and suggested a cheaper guesthouse. Super smart!',
    trip: 'Leh-Ladakh, India',
  },
  {
    name: 'Zara Ahmed',
    role: 'Couple Traveler',
    avatar: 'Z',
    color: 'from-amber-400 to-rose-500',
    rating: 5,
    text: 'We used Traveloop for our honeymoon to Greece and it was flawless. The itinerary builder made everything so organized and beautiful.',
    trip: 'Santorini, Greece',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge badge-emerald mb-4 inline-block">Testimonials</span>
          <h2 className="section-title">Loved by <span className="gradient-text">travelers worldwide</span></h2>
          <p className="section-subtitle">Real stories from people who planned unforgettable trips with Traveloop</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 relative group"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-brand-500/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role} · {t.trip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
