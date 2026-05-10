import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Globe, MapPin, Edit3, Save, X, Camera, Heart, Map } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

const tripStyles = ['Adventure', 'Cultural', 'Beach & Relaxing', 'Solo Travel', 'Romantic Getaways', 'Budget Travel']

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: 'Sneh Chauhan', email: 'sneh@traveloop.io', phone: '+91 98765 43210',
    city: 'Mumbai', country: 'India', bio: 'Passionate traveler exploring the world one trip at a time. Love mountains, street food, and authentic cultural experiences.',
    styles: ['Adventure', 'Cultural', 'Solo Travel'],
  })

  const toggleStyle = (style) => {
    setForm(f => ({ ...f, styles: f.styles.includes(style) ? f.styles.filter(s => s !== style) : [...f.styles, style] }))
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(76,175,80,0.2), transparent 60%)' }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-black">S</div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-brand-500 border-2 border-surface-100 flex items-center justify-center text-white hover:bg-brand-400 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e2d1f' }}>{form.name}</h1>
              <p className="text-slate-400 text-sm mb-3">{form.city}, {form.country}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                {form.styles.map(s => <span key={s} className="badge badge-purple">{s}</span>)}
              </div>
              <div className="flex gap-4 justify-center sm:justify-start text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg" style={{ color: '#1e2d1f' }}>12</div>
                  <div className="text-slate-500 text-xs">Trips</div>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <div className="font-bold text-lg" style={{ color: '#1e2d1f' }}>8</div>
                  <div className="text-slate-500 text-xs">Countries</div>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <div className="font-bold text-lg" style={{ color: '#1e2d1f' }}>234</div>
                  <div className="text-slate-500 text-xs">Km walked</div>
                </div>
              </div>
            </div>
            <button onClick={() => setEditing(!editing)}
              className={`flex items-center gap-2 text-sm ${editing ? 'btn-secondary' : 'btn-primary'}`}>
              {editing ? <><X className="w-4 h-4" />Cancel</> : <><Edit3 className="w-4 h-4" />Edit Profile</>}
            </button>
          </div>
        </motion.div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-brand-400" />Personal Info</h2>
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: form.name, key: 'name', icon: User },
                { label: 'Email', value: form.email, key: 'email', icon: Mail },
                { label: 'Phone', value: form.phone, key: 'phone', icon: Phone },
                { label: 'City', value: form.city, key: 'city', icon: MapPin },
                { label: 'Country', value: form.country, key: 'country', icon: Globe },
              ].map(({ label, value, key, icon: Icon }) => (
                <div key={key}>
                  <label className="text-slate-500 text-xs mb-1 block">{label}</label>
                  {editing ? (
                    <input value={value} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field text-sm" />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-700 text-sm">
                      <Icon className="w-4 h-4 text-slate-400" />{value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}><Heart className="w-4 h-4 text-brand-500" />Travel Preferences</h2>
              <div className="flex flex-wrap gap-2">
                {tripStyles.map(style => (
                  <button key={style} onClick={() => editing && toggleStyle(style)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      form.styles.includes(style) ? 'bg-leaf-light border-brand-300 text-brand-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                    } ${!editing ? 'cursor-default' : ''}`}>
                    {style}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}><Map className="w-4 h-4 text-cyan-500" />About Me</h2>
              {editing ? (
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="input-field text-sm resize-none" rows={4} />
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed">{form.bio}</p>
              )}
            </motion.div>
          </div>
        </div>

        {editing && (
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setEditing(false)} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />Save Changes
          </motion.button>
        )}
      </div>
    </DashboardLayout>
  )
}
