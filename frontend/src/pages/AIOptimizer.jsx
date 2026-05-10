import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, MapPin, DollarSign, Clock, Star, ChevronRight, Brain } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

const MOODS = [
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', color: 'amber' },
  { id: 'relaxing', label: 'Relaxing', emoji: '🏖️', color: 'cyan' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: 'rose' },
  { id: 'solo', label: 'Solo Healing', emoji: '🧘', color: 'brand' },
  { id: 'party', label: 'Party', emoji: '🎉', color: 'amber' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🕌', color: 'emerald' },
]

const INTERESTS = ['Mountains', 'Beaches', 'Culture', 'Food', 'History', 'Wildlife', 'Photography', 'Shopping']

const AI_RESULTS = {
  default: {
    cities: ['Manali', 'Leh', 'Spiti Valley'],
    activities: ['Paragliding', 'River Rafting', 'Bike Trip', 'Trekking'],
    dailyPlan: [
      { day: 1, city: 'Manali', activities: ['Arrive & acclimatize', 'Hadimba Temple', 'Old Manali walk'], cost: 4500 },
      { day: 2, city: 'Manali', activities: ['Rohtang Pass', 'Paragliding', 'Local bazaar'], cost: 5500 },
      { day: 3, city: 'Leh', activities: ['Scenic drive', 'Reach Leh', 'Rest & walk'], cost: 6000 },
      { day: 4, city: 'Leh', activities: ['Nubra Valley', 'Shyok River', 'Bactrian camels'], cost: 5000 },
    ],
    estimatedCost: 75000,
    route: 'Manali → Rohtang → Leh → Nubra Valley → Pangong Lake',
    tips: ['Book permits 48hrs in advance', 'Carry altitude medicine', 'Rent bikes locally for cheaper rates'],
  },
}

const moodColorMap = {
  amber: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', selected: 'border-amber-400 bg-amber-500/20' },
  cyan: { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-400', selected: 'border-cyan-400 bg-cyan-500/20' },
  rose: { border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-400', selected: 'border-rose-400 bg-rose-500/20' },
  brand: { border: 'border-brand-500/40', bg: 'bg-brand-500/10', text: 'text-brand-400', selected: 'border-brand-400 bg-brand-500/20' },
  emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', selected: 'border-emerald-400 bg-emerald-500/20' },
}

export default function AIOptimizer() {
  const [form, setForm] = useState({ budget: '', days: '', mood: '', interests: [] })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const loadingSteps = [
    'Analyzing your preferences...',
    'Searching 10,000+ destinations...',
    'Calculating optimal routes...',
    'Building your perfect itinerary...',
  ]

  const toggleInterest = (interest) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest) ? f.interests.filter(i => i !== interest) : [...f.interests, interest]
    }))
  }

  const handleGenerate = () => {
    if (!form.mood) return
    setLoading(true)
    setResult(null)
    setLoadingStep(0)
    const interval = setInterval(() => {
      setLoadingStep(prev => prev >= loadingSteps.length - 1 ? prev : prev + 1)
    }, 700)
    setTimeout(() => {
      clearInterval(interval)
      setLoading(false)
      setResult(AI_RESULTS.default)
    }, 3200)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow-border p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,1), transparent 60%)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Brain className="w-7 h-7 text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                AI Trip Optimizer <span className="badge badge-purple">AI Powered</span>
              </h1>
              <p className="text-slate-400">Enter your preferences and get a perfectly optimized trip in seconds</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Budget (₹)</label>
              <input id="ai-budget" type="number" placeholder="e.g. 50000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Days</label>
              <input id="ai-days" type="number" placeholder="e.g. 7" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Travel Mood</label>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(mood => {
                  const c = moodColorMap[mood.color]
                  const sel = form.mood === mood.id
                  return (
                    <button key={mood.id} id={`mood-${mood.id}`} onClick={() => setForm({ ...form, mood: mood.id })}
                      className={`p-3 rounded-xl border transition-all text-center ${sel ? c.selected : `${c.border} ${c.bg}`}`}>
                      <h3 className="text-slate-900 font-bold mb-1">{mood.emoji}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">{mood.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      form.interests.includes(interest) ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="ai-generate-btn"
              onClick={handleGenerate} disabled={loading || !form.mood}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />Generating...</>
              ) : (
                <><Sparkles className="w-5 h-5" />Generate AI Plan<Zap className="w-4 h-4" /></>
              )}
            </motion.button>
          </motion.div>

          {/* Results */}
          <div className="space-y-4">
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card glow-border p-8 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-2 border-brand-500/30 border-t-brand-400 rounded-full mx-auto mb-6" />
                  <div className="space-y-2">
                    {loadingSteps.map((step, i) => (
                      <div key={step} className={`text-sm flex items-center justify-center gap-2 ${i <= loadingStep ? 'text-brand-400' : 'text-slate-600'}`}>
                        {i < loadingStep && <Zap className="w-3 h-3" />}
                        {i === loadingStep && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-brand-400" />}
                        {step}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="glass-card glow-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-6 h-6 text-brand-500" />AI Trip Optimizer</h1>
                    <p className="text-slate-500 text-sm mt-1">Generate your perfect itinerary based on your preferences</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="glass p-3 rounded-xl">
                      <p className="text-slate-500 text-xs mb-1">Estimated Cost</p>
                      <p className="text-emerald-400 font-bold">₹{result.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div className="glass p-3 rounded-xl">
                      <p className="text-slate-500 text-xs mb-1">Cities</p>
                      <p className="text-white font-bold">{result.cities.length} stops</p>
                    </div>
                  </div>
                  <div className="glass p-3 rounded-xl">
                    <p className="text-slate-500 text-xs mb-1">Optimized Route</p>
                    <p className="text-cyan-400 text-sm font-medium">{result.route}</p>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" />Best Cities</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.cities.map(city => <span key={city} className="badge badge-cyan px-3 py-1.5">{city}</span>)}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" />Day-wise Plan</h3>
                  <div className="space-y-3">
                    {result.dailyPlan.map(day => (
                      <div key={day.day} className="glass p-3 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="badge badge-purple">Day {day.day}</span>
                            <span className="text-white text-sm font-medium">{day.city}</span>
                          </div>
                          <div className="text-emerald-600 font-semibold text-sm">₹{day.cost.toLocaleString()}</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {day.activities.map(act => <span key={act} className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">{act}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" />Smart Tips</h3>
                  <div className="space-y-2">
                    {result.tips.map(tip => (
                      <div key={tip} className="flex items-start gap-2 text-sm text-slate-400">
                        <ChevronRight className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />{tip}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <div className="glass-card p-10 text-center">
                <Brain className="w-12 h-12 text-brand-400/40 mx-auto mb-4" />
                <p className="text-slate-400 text-sm">Select your mood and hit <span className="text-brand-400 font-medium">Generate AI Plan</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
