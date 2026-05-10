import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, MapPin, Clock, DollarSign, Plus, Globe } from 'lucide-react'
import { mockDestinations, mockActivities } from '../data/mockDestinations'
import DashboardLayout from '../layouts/DashboardLayout'

const REGIONS = ['All', 'Asia', 'Europe', 'South America', 'Africa', 'South Asia']
const CATEGORIES = ['All', 'Beach & Islands', 'Cultural & Heritage', 'Adventure & Nature', 'Luxury & Beach']

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All')
  const [category, setCategory] = useState('All')
  const [tab, setTab] = useState('destinations')

  const filtered = mockDestinations.filter(d => {
    const matchQ = !query || d.name.toLowerCase().includes(query.toLowerCase()) || d.country.toLowerCase().includes(query.toLowerCase())
    const matchR = region === 'All' || d.region === region
    const matchC = category === 'All' || d.category === category
    return matchQ && matchR && matchC
  })

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Globe className="w-6 h-6 text-cyan-500" />Explore Destinations</h1>
          <p className="text-slate-500 text-sm mt-1">Discover cities, activities, and experiences worldwide</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input placeholder="Search destinations, countries, activities..." value={query} onChange={e => setQuery(e.target.value)}
            className="input-field pl-12 text-base py-4" id="explore-search" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">Filter:</span>
          </div>
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${region === r ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'}`}>
              {r}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {['destinations', 'activities'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-all ${tab === t ? 'text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:text-slate-900'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'destinations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((dest, i) => (
              <motion.div key={dest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }} className="trip-card">
                <div className="relative h-44 overflow-hidden rounded-t-xl">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-cyan">{dest.region}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-white text-xs font-semibold">{dest.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-slate-900 font-bold text-base">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs"><MapPin className="w-3 h-3" />{dest.country}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-600 text-sm font-semibold">₹{(dest.avgCost / 1000).toFixed(0)}K</div>
                      <div className="text-slate-500 text-xs">avg/trip</div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs mb-3 line-clamp-2">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock className="w-3 h-3" />{dest.duration}
                    </div>
                    <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                      <Plus className="w-3 h-3" />Add to Trip
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'activities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockActivities.map((act, i) => (
              <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-card p-4 flex items-center gap-4 hover:border-brand-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-2xl flex-shrink-0">🎯</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-900 font-semibold text-sm truncate">{act.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{act.city}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-emerald-600 text-sm font-semibold">₹{act.cost.toLocaleString()}</div>
                  <div className="flex items-center gap-1 justify-end text-xs text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500" />{act.rating}
                  </div>
                </div>
                <button className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"><Plus className="w-3 h-3" /></button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
