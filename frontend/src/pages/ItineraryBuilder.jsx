import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Plus, Trash2, ChevronDown, ChevronUp, Clock, DollarSign, MapPin, GripVertical, RefreshCw, Users } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { activityApi, stopApi, tripApi } from '../lib/api'

const activityTypeColors = {
  accommodation: 'badge-purple',
  sightseeing: 'badge-cyan',
  food: 'badge-amber',
  adventure: 'badge-rose',
  transport: 'badge-emerald',
  shopping: 'badge-purple',
  leisure: 'badge-cyan',
  rest: 'badge-emerald',
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '')

export default function ItineraryBuilder() {
  const [searchParams] = useSearchParams()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [cities, setCities] = useState([])
  const [members, setMembers] = useState([])
  const [memberEmail, setMemberEmail] = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [collapsed, setCollapsed] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [stopForm, setStopForm] = useState({ city: '', country: '', arrival_date: '', departure_date: '', notes: '' })
  const [activityForm, setActivityForm] = useState({ stop_id: '', name: '', category: 'leisure', duration_hours: '', estimated_cost: '', start_time: '', notes: '' })

  const tripId = searchParams.get('tripId')

  const load = useCallback(async () => {
    setLoading(true)
    setMessage('')
    try {
      const [tripsResult, citiesResult] = await Promise.all([
        tripApi.list(),
        fetch('/api/search/cities?q=').then(res => res.json())
      ])

      const allTrips = tripsResult.data || []
      setCities(citiesResult.data || [])

      const selected = allTrips.find((item) => String(item.id) === String(tripId)) || allTrips[0] || null
      setTrip(selected)
      if (selected) {
        const [stopsResult, membersResult] = await Promise.all([
          stopApi.list(selected.id),
          tripApi.members(selected.id).catch(() => ({ data: [] }))
        ])
        const nextStops = stopsResult.data || []
        setStops(nextStops)
        setMembers(membersResult.data || [])
        setActivityForm((form) => ({ ...form, stop_id: nextStops[0]?.id ? String(nextStops[0].id) : '' }))
      } else {
        setStops([])
        setMembers([])
      }
    } catch (err) {
      setMessage(err.message || 'Unable to load itinerary')
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    load()
  }, [load])

  const totalCost = useMemo(
    () => stops.reduce((sum, stop) => sum + (stop.expenses?.reduce((inner, expense) => inner + Number(expense.amount || 0), 0) || 0), 0),
    [stops],
  )

  const toggleDay = (stopId) => {
    setCollapsed((c) => ({ ...c, [stopId]: !c[stopId] }))
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!trip || !memberEmail) return
    setAddingMember(true)
    setMessage('')
    try {
      await tripApi.addMember(trip.id, { email: memberEmail })
      setMemberEmail('')
      const membersResult = await tripApi.members(trip.id)
      setMembers(membersResult.data || [])
    } catch (err) {
      setMessage(err.message || 'Unable to add member')
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberUserId) => {
    if (!trip) return
    setAddingMember(true)
    setMessage('')
    try {
      await tripApi.removeMember(trip.id, memberUserId)
      const membersResult = await tripApi.members(trip.id)
      setMembers(membersResult.data || [])
    } catch (err) {
      setMessage(err.message || 'Unable to remove member')
    } finally {
      setAddingMember(false)
    }
  }

  const addStop = async (e) => {
    e.preventDefault()
    if (!trip) return
    setSaving(true)
    setMessage('')
    try {
      await stopApi.create({
        trip_id: trip.id,
        city: stopForm.city,
        country: stopForm.country,
        arrival_date: stopForm.arrival_date,
        departure_date: stopForm.departure_date,
        notes: stopForm.notes,
      })
      setStopForm({ city: '', country: '', arrival_date: '', departure_date: '', notes: '' })
      await load()
    } catch (err) {
      setMessage(err.message || 'Unable to add stop')
    } finally {
      setSaving(false)
    }
  }

  const addActivity = async (e) => {
    e.preventDefault()
    if (!activityForm.stop_id) return
    setSaving(true)
    setMessage('')
    try {
      await activityApi.create({
        stop_id: activityForm.stop_id,
        name: activityForm.name,
        category: activityForm.category,
        duration_hours: activityForm.duration_hours,
        estimated_cost: activityForm.estimated_cost,
        start_time: activityForm.start_time,
        notes: activityForm.notes,
      })
      setActivityForm((form) => ({ ...form, name: '', duration_hours: '', estimated_cost: '', start_time: '', notes: '' }))
      await load()
    } catch (err) {
      setMessage(err.message || 'Unable to add activity')
    } finally {
      setSaving(false)
    }
  }

  const removeStop = async (stopId) => {
    setSaving(true)
    setMessage('')
    try {
      await stopApi.remove(stopId)
      await load()
    } catch (err) {
      setMessage(err.message || 'Unable to delete stop')
    } finally {
      setSaving(false)
    }
  }

  const removeActivity = async (activityId) => {
    setSaving(true)
    setMessage('')
    try {
      await activityApi.remove(activityId)
      await load()
    } catch (err) {
      setMessage(err.message || 'Unable to delete activity')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}>
              <Calendar className="w-6 h-6 text-brand-500" />
              Itinerary Builder
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {trip ? `${trip.title} · ${stops.length} stops` : 'Select a trip to start building'}
            </p>
          </div>
          <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {message && <div className="glass-card p-4 text-sm text-rose-600 bg-rose-50 border-rose-200">{message}</div>}

        {loading ? (
          <div className="glass-card p-8 text-center text-slate-500">Loading itinerary...</div>
        ) : (
          <>
            {trip && (
              <div className="glass-card p-5 space-y-4">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-500" />
                  Trip Collaborators
                </h2>
                
                <div className="flex flex-wrap gap-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-1 pr-3 py-1 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 uppercase">
                        {member.user?.firstName?.charAt(0) || member.user?.email?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{member.user?.firstName || member.user?.email}</span>
                      <button onClick={() => handleRemoveMember(member.userId)} className="text-rose-400 hover:text-rose-600 ml-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {members.length === 0 && <p className="text-sm text-slate-500">No collaborators yet.</p>}
                </div>

                <form onSubmit={handleAddMember} className="flex gap-3 max-w-md mt-2">
                  <input 
                    type="email" 
                    className="input-field flex-1" 
                    placeholder="Collaborator's email address" 
                    value={memberEmail} 
                    onChange={(e) => setMemberEmail(e.target.value)} 
                    required
                  />
                  <button disabled={addingMember || !trip} className="btn-primary text-sm whitespace-nowrap px-4">
                    {addingMember ? 'Adding...' : 'Add Member'}
                  </button>
                </form>
              </div>
            )}

            <div className="glass-card p-5 space-y-4">
              <h2 className="font-semibold text-slate-900">Add Stop</h2>
              <datalist id="cities-list">
                {cities.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
              <form onSubmit={addStop} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <input list="cities-list" className="input-field" placeholder="City" value={stopForm.city} onChange={(e) => setStopForm((f) => ({ ...f, city: e.target.value }))} />
                <input className="input-field" placeholder="Country" value={stopForm.country} onChange={(e) => setStopForm((f) => ({ ...f, country: e.target.value }))} />
                <input className="input-field" type="date" value={stopForm.arrival_date} onChange={(e) => setStopForm((f) => ({ ...f, arrival_date: e.target.value }))} />
                <input className="input-field" type="date" value={stopForm.departure_date} onChange={(e) => setStopForm((f) => ({ ...f, departure_date: e.target.value }))} />
                <button disabled={saving || !trip} className="btn-primary text-sm">Add Stop</button>
                <textarea className="input-field md:col-span-2 lg:col-span-5 resize-none" rows={2} placeholder="Notes"
                  value={stopForm.notes} onChange={(e) => setStopForm((f) => ({ ...f, notes: e.target.value }))} />
              </form>
            </div>

            <div className="glass-card p-5 space-y-4">
              <h2 className="font-semibold text-slate-900">Add Activity</h2>
              <form onSubmit={addActivity} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                <select className="input-field lg:col-span-1" value={activityForm.stop_id} onChange={(e) => setActivityForm((f) => ({ ...f, stop_id: e.target.value }))}>
                  <option value="">Select stop</option>
                  {stops.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.city?.name || stop.customCity || 'Stop'} 
                    </option>
                  ))}
                </select>
                <input className="input-field lg:col-span-2" placeholder="Activity name" value={activityForm.name} onChange={(e) => setActivityForm((f) => ({ ...f, name: e.target.value }))} />
                <select className="input-field" value={activityForm.category} onChange={(e) => setActivityForm((f) => ({ ...f, category: e.target.value }))}>
                  {['leisure', 'adventure', 'food', 'sightseeing', 'transport', 'shopping'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <input className="input-field" placeholder="Duration hrs" value={activityForm.duration_hours} onChange={(e) => setActivityForm((f) => ({ ...f, duration_hours: e.target.value }))} />
                <input className="input-field" placeholder="Estimated cost" value={activityForm.estimated_cost} onChange={(e) => setActivityForm((f) => ({ ...f, estimated_cost: e.target.value }))} />
                <input className="input-field" type="time" value={activityForm.start_time} onChange={(e) => setActivityForm((f) => ({ ...f, start_time: e.target.value }))} />
                <textarea className="input-field md:col-span-2 lg:col-span-6 resize-none" rows={2} placeholder="Activity notes"
                  value={activityForm.notes} onChange={(e) => setActivityForm((f) => ({ ...f, notes: e.target.value }))} />
                <button disabled={saving || !activityForm.stop_id} className="btn-primary text-sm lg:col-span-6">Add Activity</button>
              </form>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm">{trip?.startDate ? formatDate(trip.startDate) : ''} - {trip?.endDate ? formatDate(trip.endDate) : ''}</p>
              <p className="text-slate-500 text-sm">Trip budget: ₹{Number(trip?.budget || 0).toLocaleString()} | Tracked expenses: ₹{totalCost.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              {stops.map((stop, dayIndex) => {
                const stopCost = stop.expenses?.reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0
                const isCollapsed = collapsed[stop.id]
                return (
                  <motion.div key={stop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dayIndex * 0.08 }}
                    className="glass-card overflow-hidden">
                    <button onClick={() => toggleDay(stop.id)} className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-leaf-light border border-brand-200 flex flex-col items-center justify-center">
                          <span className="text-xs text-brand-600 font-medium">Stop</span>
                          <span className="font-black text-lg leading-none" style={{ color: '#1e2d1f' }}>{dayIndex + 1}</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold" style={{ color: '#1e2d1f' }}>{stop.city?.name || stop.customCity || 'Custom stop'}</h3>
                          <p className="text-slate-500 text-sm">{formatDate(stop.startDate)} · {stop.activities?.length || 0} activities</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400 text-sm font-semibold">₹{stopCost.toLocaleString()}</span>
                        {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="px-5 pb-5">
                        <div className="space-y-2 mb-3">
                          {stop.activities?.map((activity) => {
                            const cityActivity = activity.cityActivity
                            const label = cityActivity?.name || activity.customActivity || 'Activity'
                            const type = String(cityActivity?.category || 'leisure').toLowerCase()
                            return (
                              <motion.div key={activity.id} layout className="flex items-center gap-3 glass p-3 rounded-xl group hover:border-white/10 transition-all">
                                <GripVertical className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span className="text-slate-400 text-xs w-10">{cityActivity?.availabilityTime || activity.scheduledTime || '--:--'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-sm truncate" style={{ color: '#1e2d1f' }}>{label}</span>
                                    <span className={`badge ${activityTypeColors[type] || 'badge-purple'} capitalize`}>{type}</span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{stop.city?.name || stop.customCity || 'City'}</span>
                                    {activity.estimatedCost && <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="w-3 h-3" />₹{Number(activity.estimatedCost).toLocaleString()}</span>}
                                  </div>
                                </div>
                                <button onClick={() => removeActivity(activity.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-all">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            )
                          })}
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setActivityForm((form) => ({ ...form, stop_id: String(stop.id) }))} className="btn-secondary text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" />Use for Activity
                          </button>
                          <button onClick={() => removeStop(stop.id)} className="btn-secondary text-sm flex items-center gap-2 text-rose-600">
                            <Trash2 className="w-4 h-4" />Delete Stop
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
