import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, MapPin, Clock, Plus, Globe } from 'lucide-react'
import { mockTrips } from '../data/mockTrips'
import DashboardLayout from '../layouts/DashboardLayout'

const TABS = ['All', 'Ongoing', 'Upcoming', 'Completed']
const TYPES = ['All Types', 'Adventure', 'Cultural', 'Relaxing', 'Romantic']

const statusColors = {
  ongoing: 'badge-emerald',
  upcoming: 'badge-cyan',
  completed: 'badge-purple',
}

export default function MyTrips() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All Types')

  const filtered = mockTrips.filter(t => {
    const matchTab = tab === 'All' || t.status === tab.toLowerCase()
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.destinations.some(d => d.toLowerCase().includes(search.toLowerCase()))
    const matchType = type === 'All Types' || t.type === type
    return matchTab && matchSearch && matchType
  })

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Trips</h1>
            <p className="text-slate-500 text-sm mt-1">{mockTrips.length} trips · {mockTrips.filter(t => t.status === 'upcoming').length} upcoming</p>
          </div>
        </div>

        {/* Search + Filter */}
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

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t ? 'bg-brand-50 border border-brand-200 text-brand-600' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
              }`}>
              {t}
              <span className="ml-2 text-xs opacity-60">
                {t === 'All' ? mockTrips.length : mockTrips.filter(x => x.status === t.toLowerCase()).length}
              </span>
            </button>
          ))}
        </div>

        {/* Trip Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }} className="trip-card">
              <div className="relative h-44 overflow-hidden rounded-t-xl">
                <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`badge ${statusColors[trip.status]} capitalize`}>{trip.status}</span>
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
                  <span className="truncate">{trip.destinations.slice(0, 2).join(' · ')}{trip.destinations.length > 2 ? ` +${trip.destinations.length - 2}` : ''}</span>
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
                {/* Budget bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Budget</span>
                    <span className={`font-medium ${trip.spent > trip.budget ? 'text-rose-600' : trip.spent / trip.budget > 0.8 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      ₹{trip.spent.toLocaleString()} / ₹{trip.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200">
                    <div className={`h-full rounded-full transition-all ${trip.spent > trip.budget ? 'bg-rose-500' : trip.spent / trip.budget > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min((trip.spent / trip.budget) * 100, 100)}%` }} />
                  </div>
                </div>
                <button className="btn-secondary w-full text-sm py-2">View Trip</button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No trips found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
