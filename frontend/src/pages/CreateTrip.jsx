import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarPlus, MapPin, DollarSign, FileText, Tag, Image, Sparkles } from 'lucide-react'
import { mockDestinations } from '../data/mockDestinations'
import DashboardLayout from '../layouts/DashboardLayout'
import { Link, useNavigate } from 'react-router-dom'

const TRIP_TYPES = ['Adventure', 'Cultural', 'Beach & Relaxing', 'Romantic', 'Solo', 'Spiritual', 'Party', 'Road Trip']

export default function CreateTrip() {
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', description: '', type: '', budget: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCreate = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/itinerary') }, 1500)
  }

  const featured = mockDestinations.slice(0, 4)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><CalendarPlus className="w-6 h-6 text-brand-500" />Create New Trip</h1>
          <p className="text-slate-500 text-sm mt-1">Start planning your next adventure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCreate} className="glass-card p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Trip Name *</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="trip-name" placeholder="e.g. Himalayan Summer Adventure" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} className="input-field pl-11" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Start Date *</label>
                  <input id="trip-start" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">End Date *</label>
                  <input id="trip-end" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="input-field" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                  <textarea id="trip-desc" placeholder="Describe your trip..." value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} className="input-field pl-11 resize-none" rows={3} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Trip Type</label>
                <div className="flex flex-wrap gap-2">
                  {TRIP_TYPES.map(type => (
                    <button key={type} type="button" onClick={() => setForm({ ...form, type })}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${form.type === type ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Budget (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="trip-budget" type="number" placeholder="e.g. 50000" value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })} className="input-field pl-11" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                  {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Creating...</> : <><CalendarPlus className="w-4 h-4" />Create Trip</>}
                </motion.button>
                <Link to="/ai-optimizer">
                  <button type="button" className="btn-secondary flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-brand-400" />Use AI Optimizer
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* Inspiration */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4">✨ Trip Inspiration</h2>
            <div className="space-y-3">
              {featured.map((dest, i) => (
                <motion.div key={dest.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-card p-3 flex items-center gap-3 hover:border-brand-500/30 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 text-sm font-semibold truncate">{dest.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs"><MapPin className="w-3 h-3" />{dest.country}</div>
                  </div>
                  <div className="text-emerald-600 text-xs font-semibold flex-shrink-0">₹{(dest.avgCost / 1000).toFixed(0)}K</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
