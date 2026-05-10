import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Globe, DollarSign, Calendar, Sparkles, Map, Plus,
  ArrowRight, Star, MapPin, Clock, Zap, ChevronRight
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { mockTrips } from '../data/mockTrips'
import { mockDestinations } from '../data/mockDestinations'
import { formatCompact } from '../utils/formatCurrency'

const stats = [
  { label: 'Trips Completed', value: '12', icon: Map, color: 'brand', change: '+3 this year' },
  { label: 'Countries Explored', value: '8', icon: Globe, color: 'cyan', change: '+2 new' },
  { label: 'Budget Saved', value: '₹45K', icon: DollarSign, color: 'emerald', change: 'vs avg spending' },
  { label: 'Upcoming Trips', value: '3', icon: Calendar, color: 'amber', change: 'Next: Jun 1' },
]

const colorMap = {
  brand: { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
}

const quickActions = [
  { label: 'New Trip', to: '/create-trip', icon: Plus, color: 'btn-primary' },
  { label: 'AI Optimizer', to: '/ai-optimizer', icon: Sparkles, color: 'btn-secondary' },
  { label: 'Budget', to: '/budget', icon: DollarSign, color: 'btn-secondary' },
  { label: 'Explore', to: '/explore', icon: Globe, color: 'btn-secondary' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  const ongoingTrip = mockTrips.find(t => t.status === 'ongoing')
  const upcomingTrips = mockTrips.filter(t => t.status === 'upcoming').slice(0, 3)
  const topDests = mockDestinations.filter(d => d.popular).slice(0, 4)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass-card p-6 overflow-hidden glow-border"
        >
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(76,175,80,0.3), transparent 60%)' }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Good morning ✨</p>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e2d1f' }}>Welcome back, Sneh!</h1>
              <p className="text-slate-500">You have <span className="text-brand-600 font-semibold">3 upcoming trips</span> and <span className="text-amber-500 font-semibold">1 ongoing adventure</span>.</p>
            </div>
            <Link to="/create-trip">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Plan New Trip
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, to, icon: Icon, color }) => (
            <Link key={label} to={to}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`${color} flex items-center gap-2 text-sm py-2.5 px-4`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.button>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            const c = colorMap[stat.color]
            return (
              <motion.div key={stat.label} variants={itemVariants} className="stat-card">
                <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <div className="text-2xl font-black" style={{ color: '#1e2d1f' }}>{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
                <div className={`text-xs mt-1 ${c.text}`}>{stat.change}</div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ongoing Trip */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Clock className="w-5 h-5 text-brand-500" />
              Ongoing Trip
            </h2>
            {ongoingTrip ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="trip-card relative"
              >
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <img src={ongoingTrip.coverImage} alt={ongoingTrip.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-100 via-surface-100/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-emerald">🟢 Ongoing</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#1e2d1f' }}>{ongoingTrip.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    {ongoingTrip.destinations.join(' → ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Budget used</p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-1.5 rounded-full" style={{ background: '#dff3e3' }}>
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${(ongoingTrip.spent / ongoingTrip.budget) * 100}%` }}
                          />
                        </div>
                        <span className="text-amber-400 text-xs">{Math.round((ongoingTrip.spent / ongoingTrip.budget) * 100)}%</span>
                      </div>
                    </div>
                    <Link to="/itinerary">
                      <button className="btn-primary text-sm py-2 flex items-center gap-1">
                        View Itinerary <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 text-center">
                <p className="text-slate-500">No ongoing trips</p>
              </div>
            )}
          </div>

          {/* AI Optimizer Promo */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Sparkles className="w-5 h-5 text-brand-500" />
              AI Optimizer
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card glow-border p-6 relative overflow-hidden h-full"
            >
              <div className="absolute inset-0 opacity-10"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(76,175,80,0.5), transparent 70%)' }}
              />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1e2d1f' }}>AI Trip Optimizer</h3>
                <p className="text-slate-500 text-sm mb-4 flex-1">
                  Enter your budget and mood. Our AI generates your perfect itinerary in seconds.
                </p>
                <div className="space-y-2 mb-4">
                  {['Best cities for your budget', 'Day-wise optimized plan', 'Activity suggestions'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-500">
                      <Zap className="w-3 h-3 text-brand-500" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link to="/ai-optimizer">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Try AI Optimizer
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Top Destinations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Globe className="w-5 h-5 text-cyan-500" />
              Top Destinations
            </h2>
            <Link to="/explore" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topDests.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="trip-card"
              >
                <div className="relative h-32 overflow-hidden rounded-t-xl">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {dest.rating}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm" style={{ color: '#1e2d1f' }}>{dest.name}</h3>
                  <p className="text-slate-500 text-xs">{dest.country}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Calendar className="w-5 h-5 text-amber-500" />
              Upcoming Trips
            </h2>
            <Link to="/trips" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 flex items-center gap-4 hover:border-brand-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate" style={{ color: '#1e2d1f' }}>{trip.name}</h3>
                  <p className="text-slate-500 text-xs">{trip.destinations[0]} · {trip.duration} days</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-brand-600 text-sm font-semibold">{formatCompact(trip.budget)}</p>
                  <p className="text-slate-500 text-xs">{trip.startDate}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
