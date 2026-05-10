import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, MapPin, Clock, Plus, Globe, RefreshCw } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { searchApi } from '../lib/api'

const REGIONS = ['All', 'Asia', 'Europe', 'South America', 'Africa', 'South Asia']
const TABS = ['destinations', 'activities', 'trending']

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All')
  const [tab, setTab] = useState('destinations')
  const [destinations, setDestinations] = useState([])
  const [activities, setActivities] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        if (tab === 'destinations') {
          const result = await searchApi.cities(query)
          if (!active) return
          setDestinations(result.data || [])
        } else if (tab === 'activities') {
          const result = await searchApi.activities(query)
          if (!active) return
          setActivities(result.data || [])
        } else {
          const result = await searchApi.trending()
          if (!active) return
          setTrending(result.data || [])
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to search')
      } finally {
        if (active) setLoading(false)
      }
    }, 250)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, tab])

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => region === 'All' || d.vibe?.toLowerCase().includes(region.toLowerCase()) || d.country?.toLowerCase().includes(region.toLowerCase()))
  }, [destinations, region])

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Globe className="w-6 h-6 text-cyan-500" />Explore Destinations</h1>
          <p className="text-slate-500 text-sm mt-1">Search cities, activities, and trending destinations from the backend.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input placeholder="Search destinations, countries, activities..." value={query} onChange={e => setQuery(e.target.value)}
            className="input-field pl-12 text-base py-4" id="explore-search" />
        </div>

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

        <div className="flex gap-2 border-b border-slate-200">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-all ${tab === t ? 'text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:text-slate-900'}`}>
              {t}
            </button>
          ))}
        </div>

        {error && <div className="glass-card p-4 text-sm text-rose-600 bg-rose-50 border-rose-200">{error}</div>}

        {loading ? (
          <div className="glass-card p-8 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : (
          <>
            {tab === 'destinations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredDestinations.map((dest, i) => (
                  <motion.div key={dest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -4 }} className="trip-card">
                    <div className="relative h-44 overflow-hidden rounded-t-xl">
                      <img src={dest.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'} alt={dest.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-cyan">{dest.vibe || dest.country}</span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-slate-900 text-xs font-semibold">4.8</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-slate-900 font-bold text-base">{dest.name}</h3>
                          <div className="flex items-center gap-1 text-slate-500 text-xs"><MapPin className="w-3 h-3" />{dest.country}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-600 text-sm font-semibold">₹{Number(dest.average_daily_cost || 0).toLocaleString()}</div>
                          <div className="text-slate-500 text-xs">avg/day</div>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs mb-3 line-clamp-2">{dest.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Clock className="w-3 h-3" />{dest.best_season || 'Year round'}
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
                {activities.map((act, i) => (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="glass-card p-4 flex items-center gap-4 hover:border-brand-500/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-2xl flex-shrink-0">🎯</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-900 font-semibold text-sm truncate">{act.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{act.city?.name || 'Unknown city'}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration || 'Flexible'}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-emerald-600 text-sm font-semibold">₹{Number(act.price || 0).toLocaleString()}</div>
                      <div className="flex items-center gap-1 justify-end text-xs text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />4.7
                      </div>
                    </div>
                    <button className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"><Plus className="w-3 h-3" /></button>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'trending' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trending.map((item) => (
                  <div key={item.rank} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">#{item.rank}</p>
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-600 font-semibold">{item.trend}</p>
                      <p className="text-xs text-slate-500">{Number(item.views || 0).toLocaleString()} views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
