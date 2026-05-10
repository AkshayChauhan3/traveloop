import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, DollarSign, TrendingDown, CheckCircle, PieChart, BarChart2, RefreshCw } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'
import { expenseApi, tripApi } from '../lib/api'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs shadow-xl">
        {payload.map(p => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-slate-900 font-semibold">₹{Number(p.value || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function BudgetAnalytics() {
  const [trips, setTrips] = useState([])
  const [tripId, setTripId] = useState('')
  const [budgetSummary, setBudgetSummary] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setMessage('')
    try {
      const tripsResult = await tripApi.list()
      const allTrips = tripsResult.data || []
      setTrips(allTrips)
      const selectedId = tripId || allTrips[0]?.id
      if (selectedId) {
        setTripId(String(selectedId))
        const trip = allTrips.find((item) => String(item.id) === String(selectedId))
        const [expensesResult, summaryResult] = await Promise.all([
          expenseApi.listByTrip(selectedId),
          expenseApi.summary(selectedId, trip?.budget || 0),
        ])
        setExpenses(expensesResult.data || [])
        setBudgetSummary(summaryResult.data || null)
      } else {
        setExpenses([])
        setBudgetSummary(null)
      }
    } catch (err) {
      setMessage(err.message || 'Unable to load budget analytics')
    }
  }, [tripId])

  useEffect(() => {
    load()
  }, [load])

  const pct = Number(budgetSummary?.spending_percentage || 0)
  const remaining = Number(budgetSummary?.remaining_budget || 0)

  const byCategory = useMemo(() => {
    return Object.entries(budgetSummary?.by_category || {}).map(([name, value]) => ({
      name,
      value: Number(value || 0),
      color: {
        transport: '#4CAF50',
        accommodation: '#6FBF73',
        activities: '#f59e0b',
        meals: '#06b6d4',
        shopping: '#f43f5e',
        other: '#94a3b8',
      }[name] || '#94a3b8',
    })).filter((item) => item.value > 0)
  }, [budgetSummary])

  const dayData = useMemo(() => {
    const grouped = new Map()
    expenses.forEach((expense) => {
      const key = new Date(expense.date).toLocaleDateString()
      const current = grouped.get(key) || { day: key, budget: Number(budgetSummary?.total_budget || 0) / Math.max(expenses.length || 1, 1), spent: 0 }
      current.spent += Number(expense.amount || 0)
      grouped.set(key, current)
    })
    return Array.from(grouped.values()).slice(0, 7)
  }, [expenses, budgetSummary])

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow-border-amber p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.5), transparent 60%)' }} />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}>
                  Smart Budget Analytics <span className="badge badge-amber">Live</span>
                </h1>
                <p className="text-slate-500">Backend expense summary for your selected trip</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select value={tripId} onChange={(e) => setTripId(e.target.value)} className="input-field w-56 text-sm">
                {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}
              </select>
              <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {message && <div className="glass-card p-4 text-sm text-rose-600 bg-rose-50 border-rose-200">{message}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Budget', value: `₹${Number(budgetSummary?.total_budget || 0).toLocaleString()}`, icon: DollarSign, color: 'brand', sub: trips.find(t => String(t.id) === tripId)?.title || 'Selected trip' },
            { label: 'Amount Spent', value: `₹${Number(budgetSummary?.total_spent || 0).toLocaleString()}`, icon: TrendingDown, color: pct >= 80 ? 'amber' : 'emerald', sub: `${pct}% used` },
            { label: 'Remaining', value: `₹${remaining.toLocaleString()}`, icon: CheckCircle, color: remaining < 0 ? 'rose' : 'emerald', sub: remaining >= 0 ? 'On track' : 'Over budget!' },
          ].map(card => {
            const Icon = card.icon
            const c = { brand: 'text-brand-500 bg-leaf-light border-brand-200', amber: 'text-amber-500 bg-amber-50 border-amber-200', emerald: 'text-emerald-500 bg-emerald-50 border-emerald-200', rose: 'text-rose-500 bg-rose-50 border-rose-200' }[card.color]
            return (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
                <div className={`w-10 h-10 rounded-xl ${c} border flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black" style={{ color: '#1e2d1f' }}>{card.value}</div>
                <div className="text-slate-500 text-sm">{card.label}</div>
                <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold" style={{ color: '#1e2d1f' }}>Overall Budget Usage</span>
            <span className={`text-lg font-bold ${pct >= 100 ? 'text-rose-400' : pct >= 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{pct}%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#dff3e3' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className={`h-full rounded-full ${pct >= 100 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>₹0</span><span>₹{Number(budgetSummary?.total_budget || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}><BarChart2 className="w-4 h-4 text-brand-500" />Day-wise Spending</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dayData} barGap={4}>
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget" name="Budget" fill="rgba(76,175,80,0.2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}><PieChart className="w-4 h-4 text-cyan-500" />Spending by Category</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={180}>
                <RechartsPie>
                  <Pie data={byCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {byCategory.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-slate-500 capitalize">{item.name}</span>
                    </div>
                    <span className="font-medium" style={{ color: '#1e2d1f' }}>₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Budget Details
          </h3>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <div>
                  <p className="font-medium text-slate-900 capitalize">{expense.category}</p>
                  <p className="text-xs text-slate-500">{expense.description || 'No description'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">₹{Number(expense.amount || 0).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
