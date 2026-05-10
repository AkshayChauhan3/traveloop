import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Plus, Trash2, ChevronDown, ChevronUp, Clock, DollarSign, MapPin, GripVertical } from 'lucide-react'
import { mockItinerary } from '../data/mockTrips'
import DashboardLayout from '../layouts/DashboardLayout'

const activityTypeColors = {
  accommodation: 'badge-purple',
  sightseeing:   'badge-cyan',
  food:          'badge-amber',
  adventure:     'badge-rose',
  transport:     'badge-emerald',
  shopping:      'badge-purple',
  leisure:       'badge-cyan',
  rest:          'badge-emerald',
}

export default function ItineraryBuilder() {
  const [days, setDays] = useState(mockItinerary)
  const [collapsed, setCollapsed] = useState({})

  const toggleDay = (dayNum) => setCollapsed(c => ({ ...c, [dayNum]: !c[dayNum] }))

  const addActivity = (dayIndex) => {
    const newActivity = {
      id: `new-${Date.now()}`,
      time: '12:00',
      title: 'New Activity',
      type: 'leisure',
      cost: 0,
      duration: '1 hr',
    }
    setDays(prev => prev.map((d, i) => i === dayIndex ? { ...d, activities: [...d.activities, newActivity] } : d))
  }

  const removeActivity = (dayIndex, actId) => {
    setDays(prev => prev.map((d, i) => i === dayIndex ? { ...d, activities: d.activities.filter(a => a.id !== actId) } : d))
  }

  const addDay = () => {
    const nextDay = days.length + 1
    setDays(prev => [...prev, { day: nextDay, date: `2024-06-0${nextDay}`, city: 'New City', activities: [] }])
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Calendar className="w-6 h-6 text-brand-500" />
              Itinerary Builder
            </h1>
            <p className="text-slate-500 text-sm mt-1">Himalayan Adventure · {days.length} days · Jun 1–12</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} onClick={addDay} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Add Day
          </motion.button>
        </div>

        {/* Day Sections */}
        <div className="space-y-4">
          {days.map((day, dayIndex) => {
            const totalCost = day.activities.reduce((s, a) => s + a.cost, 0)
            const isCollapsed = collapsed[day.day]
            return (
              <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dayIndex * 0.1 }}
                className="glass-card overflow-hidden">
                {/* Day Header */}
                <button onClick={() => toggleDay(day.day)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-leaf-light border border-brand-200 flex flex-col items-center justify-center">
                      <span className="text-xs text-brand-600 font-medium">Day</span>
                      <span className="font-black text-lg leading-none" style={{ color: '#1e2d1f' }}>{day.day}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold" style={{ color: '#1e2d1f' }}>{day.city}</h3>
                      <p className="text-slate-500 text-sm">{day.date} · {day.activities.length} activities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 text-sm font-semibold">₹{totalCost.toLocaleString()}</span>
                    {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Activities */}
                {!isCollapsed && (
                  <div className="px-5 pb-5">
                    <div className="space-y-2 mb-3">
                      {day.activities.map((activity) => (
                        <motion.div key={activity.id} layout
                          className="flex items-center gap-3 glass p-3 rounded-xl group hover:border-white/10 transition-all">
                          <GripVertical className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-400 text-xs w-10">{activity.time}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm truncate" style={{ color: '#1e2d1f' }}>{activity.title}</span>
                              <span className={`badge ${activityTypeColors[activity.type] || 'badge-purple'} capitalize`}>{activity.type}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>
                              {activity.cost > 0 && <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="w-3 h-3" />₹{activity.cost.toLocaleString()}</span>}
                            </div>
                          </div>
                          <button onClick={() => removeActivity(dayIndex, activity.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    <button onClick={() => addActivity(dayIndex)}
                      className="w-full py-2.5 rounded-xl border border-dashed text-slate-500 hover:text-brand-600 transition-all flex items-center justify-center gap-2 text-sm"
                      style={{ borderColor: '#bce8bc' }}>
                      <Plus className="w-4 h-4" />Add Activity
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
