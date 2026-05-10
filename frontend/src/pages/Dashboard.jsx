import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Globe, DollarSign, Calendar, Map, Plus,
  ArrowRight, Star, MapPin, Clock, ChevronRight
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { tripApi, searchApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const quickActions = [
  { label: 'New Trip', to: '/create-trip', icon: Plus, color: 'btn-primary' },
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

const fallbackCover = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'

const toCard = (trip, index) => ({
  id: trip.id,
  name: trip.title,
  status: String(trip.status || 'PLANNED').toLowerCase(),
  destinations: trip.stops?.map((stop) => stop.city?.name || stop.customCity || 'Custom stop') || [],
  coverImage: trip.coverPhoto || fallbackCover,
  budget: Number(trip.budget || 0),
  spent: Number(trip.expenses?.reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0),
  startDate: trip.startDate ? new Date(trip.startDate).toLocaleDateString() : '',
  stopCount: trip.stops?.length || 0,
  index,
})

export default function Dashboard() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [topDests, setTopDests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const [tripsResult, trendsResult] = await Promise.all([
          tripApi.list(),
          searchApi.trending().catch(() => ({ data: [] })),
        ])
        if (!active) return
        setTrips(tripsResult.data || [])
        setTopDests(trendsResult.data || [])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const mappedTrips = useMemo(() => trips.map(toCard), [trips])
  const ongoingTrip = mappedTrips.find(t => t.status === 'ongoing')
  const upcomingTrips = mappedTrips.filter(t => t.status === 'planned').slice(0, 3)
  const totalBudget = mappedTrips.reduce((sum, trip) => sum + trip.budget, 0)
  const totalSpent = mappedTrips.reduce((sum, trip) => sum + trip.spent, 0)

  const stats = [
    { label: 'Trips Active', value: String(mappedTrips.length), icon: Map, color: 'brand', change: `${upcomingTrips.length} planned` },
    { label: 'Countries Explored', value: String(new Set(mappedTrips.flatMap(t => t.destinations)).size || 0), icon: Globe, color: 'cyan', change: 'From trip stops' },
    { label: 'Budget Tracked', value: `₹${Math.round(totalBudget / 1000)}K`, icon: DollarSign, color: 'emerald', change: `₹${totalSpent.toLocaleString()} spent` },
    { label: 'Upcoming Trips', value: String(upcomingTrips.length), icon: Calendar, color: 'amber', change: upcomingTrips[0]?.startDate ? `Next: ${upcomingTrips[0].startDate}` : 'Create one now' },
  ]

  const colorMap = {
    brand: { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
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
              <p className="text-slate-500 text-sm mb-1">Good day ✨</p>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e2d1f' }}>
                Welcome back, {user?.firstName || 'Traveler'}!
              </h1>
              <p className="text-slate-500">
                You have <span className="text-brand-600 font-semibold">{upcomingTrips.length} upcoming trips</span> and <span className="text-amber-500 font-semibold">{ongoingTrip ? 1 : 0} ongoing adventure</span>.
              </p>
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

        <div className="grid grid-cols-1 gap-6">
          <div className="w-full">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Clock className="w-5 h-5 text-brand-500" />
              Ongoing Trip
            </h2>
            {loading ? (
              <div className="glass-card p-8 text-center text-slate-500">Loading trips...</div>
            ) : ongoingTrip ? (
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
                    {ongoingTrip.destinations.join(' → ') || 'No stops yet'}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Budget used</p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-1.5 rounded-full" style={{ background: '#dff3e3' }}>
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${Math.min((ongoingTrip.spent / (ongoingTrip.budget || 1)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-amber-400 text-xs">{Math.round((ongoingTrip.spent / (ongoingTrip.budget || 1)) * 100)}%</span>
                      </div>
                    </div>
                    <Link to={`/itinerary?tripId=${ongoingTrip.id}`}>
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

          </div>
        </div>

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
            {topDests.slice(0, 4).map((dest, i) => (
              <motion.div
                key={`${dest.rank}-${dest.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="trip-card"
              >
                <div className="relative h-32 overflow-hidden rounded-t-xl bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {dest.trend || 'Popular'}
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

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Map className="w-5 h-5 text-brand-500" />
              Upcoming Trips
            </h2>
          </div>
          {upcomingTrips.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="trip-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{trip.name}</h3>
                    <span className="badge badge-cyan capitalize">{trip.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{trip.destinations.join(' · ') || 'No stops yet'}</p>
                  <button onClick={() => window.location.assign(`/itinerary?tripId=${trip.id}`)} className="btn-secondary w-full text-sm py-2">
                    Open itinerary
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-slate-500">No upcoming trips. Create one from the trip planner.</div>
          )}
        </div>
    </DashboardLayout>
  )
}
