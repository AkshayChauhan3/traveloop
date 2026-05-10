import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, MapPin, Search, Heart, Copy, Users, Star } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

const communityTrips = [
  {
    id: 'c1', author: 'Riya Patel', avatar: 'R', color: 'from-brand-400 to-brand-600',
    name: 'Bali Spirit Tour', destinations: ['Ubud', 'Seminyak', 'Uluwatu'], days: 8,
    likes: 234, copies: 56, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    tags: ['spiritual', 'cultural'], budget: 55000, rating: 4.9,
  },
  {
    id: 'c2', author: 'Karan Mehta', avatar: 'K', color: 'from-cyan-400 to-brand-500',
    name: 'Swiss Alps Winter', destinations: ['Zurich', 'Interlaken', 'Zermatt'], days: 10,
    likes: 412, copies: 89, image: 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=600&q=80',
    tags: ['adventure', 'winter'], budget: 200000, rating: 4.8,
  },
  {
    id: 'c3', author: 'Anika Roy', avatar: 'A', color: 'from-amber-400 to-rose-500',
    name: 'Rajasthan Royal', destinations: ['Jaipur', 'Jodhpur', 'Udaipur'], days: 7,
    likes: 318, copies: 74, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    tags: ['cultural', 'heritage'], budget: 45000, rating: 4.9,
  },
  {
    id: 'c4', author: 'Dev Singh', avatar: 'D', color: 'from-emerald-400 to-cyan-500',
    name: 'Thailand Island Hopping', destinations: ['Bangkok', 'Phuket', 'Koh Samui'], days: 12,
    likes: 521, copies: 102, image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80',
    tags: ['beach', 'adventure'], budget: 120000, rating: 4.7,
  },
]

export default function Community() {
  const [liked, setLiked] = useState({})
  const [search, setSearch] = useState('')

  const filtered = communityTrips.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.destinations.some(d => d.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}><Users className="w-6 h-6 text-brand-500" />Community Trips</h1>
            <p className="text-slate-500 text-sm mt-1">Discover and copy amazing trips from fellow travelers</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input placeholder="Search community trips..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" id="community-search" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
              whileHover={{ y: -4 }} className="trip-card">
              <div className="relative h-44 overflow-hidden rounded-t-xl">
                <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  {trip.tags.map(tag => <span key={tag} className="badge badge-purple capitalize">{tag}</span>)}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${trip.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{trip.avatar}</div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#1e2d1f' }}>{trip.name}</p>
                    <p className="text-slate-500 text-xs">by {trip.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{trip.destinations.join(' · ')}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{trip.days} days</span>
                    <span className="text-brand-600 font-semibold">₹{(trip.budget / 1000).toFixed(0)}K</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{trip.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setLiked(l => ({ ...l, [trip.id]: !l[trip.id] }))}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all ${
                    liked[trip.id] ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-400'
                  }`}>
                    <Heart className={`w-4 h-4 ${liked[trip.id] ? 'fill-rose-400' : ''}`} />
                    {trip.likes + (liked[trip.id] ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm glass border border-white/10 text-slate-400 hover:text-cyan-400 transition-all">
                    <Copy className="w-4 h-4" />Copy Trip
                  </button>
                  <button className="btn-primary text-sm py-2 px-3 ml-auto flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />Use
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
