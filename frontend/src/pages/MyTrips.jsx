import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, MapPin, Clock, Globe, RefreshCw } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { tripApi } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const TABS = ['All', 'Planned', 'Ongoing', 'Completed', 'Cancelled']
const TYPES = ['All Types', 'Adventure', 'Cultural', 'Relaxing', 'Romantic', 'Solo']

const fallbackImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=1200&q=80',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
]

const statusColors = {
  ongoing: 'badge-emerald',
  planned: 'badge-cyan',
  completed: 'badge-purple',
  cancelled: 'badge-rose',
}

const statusLabel = (value) => {
  const label = String(value || '').toLowerCase()
  return label ? label[0].toUpperCase() + label.slice(1) : 'Planned'
}

const toTripCard = (trip, index) => {
  const duration = Math.max(1, Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1)
  return {
    id: trip.id,
    name: trip.title,
    description: trip.description,
    status: String(trip.status || 'PLANNED').toLowerCase(),
    type: trip.isPublic ? 'Adventure' : 'Solo',
    startDate: trip.startDate ? new Date(trip.startDate).toLocaleDateString() : '',
    duration,
    budget: Number(trip.budget || 0),
    spent: Number(trip.expenses?.reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0),
    coverImage: trip.coverPhoto || fallbackImages[index % fallbackImages.length],
    destinations: trip.stops?.map((stop) => stop.city?.name || stop.customCity || 'Custom stop') || [],
    activities: trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0,
    rating: trip.isPublic ? 4.8 : null,
  }
}

export default function MyTrips() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All Types')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loadTrips = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await tripApi.list()
      setTrips(result.data || [])
    } catch (err) {
      setError(err.message || 'Unable to load trips')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrips()
  }, [])

  const normalizedTrips = useMemo(() => trips.map(toTripCard), [trips])

  const filtered = normalizedTrips.filter((trip) => {
    const matchTab = tab === 'All' || statusLabel(trip.status) === tab
    const matchSearch = !search
      || trip.name.toLowerCase().includes(search.toLowerCase())
      || trip.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()))
    const matchType = type === 'All Types' || trip.type === type
    return matchTab && matchSearch && matchType
  })

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Trips</h1>
            <p className="text-slate-500 text-sm mt-1">{normalizedTrips.length} trips · {normalizedTrips.filter(t => t.status === 'planned').length} planned</p>
          </div>
          <button onClick={loadTrips} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-11" id="trips-search" />
          </div>
          <select value={type} onChange={e => setType(e.target.value)} id="trips-filter-type"
            className="input-field w-full sm:w-40 text-sm">
            {TYPES.map(t => <option key={t} value={t} className="bg-white text-slate-900">{t}</option>)}
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t ? 'bg-brand-50 border border-brand-200 text-brand-600' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
              }`}>
              {t}
              <span className="ml-2 text-xs opacity-60">
                {t === 'All' ? normalizedTrips.length : normalizedTrips.filter(x => statusLabel(x.status) === t).length}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="glass-card p-4 text-sm text-rose-600 border-rose-200 bg-rose-50">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass-card p-8 text-center text-slate-500">Loading trips...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((trip, i) => (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }} className="trip-card">
                <div className="relative h-44 overflow-hidden rounded-t-xl">
                  <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`badge ${statusColors[trip.status] || 'badge-cyan'} capitalize`}>{statusLabel(trip.status)}</span>
                    <span className="badge badge-purple">{trip.type}</span>
                  </div>
                  {trip.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-slate-900 text-xs font-semibold">{trip.rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-slate-900 font-bold text-base mb-1 truncate">{trip.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{trip.destinations.length ? trip.destinations.slice(0, 2).join(' · ') : 'No stops yet'}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {trip.duration} days · {trip.startDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Globe className="w-3 h-3" />
                      {trip.activities} activities
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Budget</span>
                      <span className={`font-medium ${trip.spent > trip.budget ? 'text-rose-600' : trip.spent / (trip.budget || 1) > 0.8 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ₹{trip.spent.toLocaleString()} / ₹{trip.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200">
                      <div className={`h-full rounded-full transition-all ${trip.spent > trip.budget ? 'bg-rose-500' : trip.spent / (trip.budget || 1) > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min((trip.spent / (trip.budget || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <button onClick={() => navigate(`/itinerary?tripId=${trip.id}`)} className="btn-secondary w-full text-sm py-2">
                    Open Trip
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No trips found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
