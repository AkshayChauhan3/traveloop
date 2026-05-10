import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, DollarSign, TrendingDown, CheckCircle, PieChart, BarChart2 } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'

const BUDGET = 75000
const SPENT = 62500

const dayData = [
  { day: 'Day 1', budget: 10000, spent: 7800, city: 'Manali' },
  { day: 'Day 2', budget: 12000, spent: 13500, city: 'Manali' },
  { day: 'Day 3', budget: 15000, spent: 12000, city: 'Drive' },
  { day: 'Day 4', budget: 13000, spent: 16200, city: 'Leh' },
  { day: 'Day 5', budget: 12000, spent: 8500, city: 'Nubra' },
  { day: 'Day 6', budget: 13000, spent: 4500, city: 'Pangong' },
]

const pieData = [
  { name: 'Accommodation', value: 22000, color: '#7c3aed' },
  { name: 'Food', value: 12000, color: '#06b6d4' },
  { name: 'Transport', value: 18000, color: '#f59e0b' },
  { name: 'Activities', value: 7500, color: '#10b981' },
  { name: 'Shopping', value: 3000, color: '#f43f5e' },
]

const warnings = [
  { day: 'Day 2', city: 'Manali', over: 1500, type: 'adventure' },
  { day: 'Day 4', city: 'Leh', over: 3200, type: 'accommodation' },
]

const suggestions = [
  { icon: '🏨', text: 'Switch to budget guesthouse in Leh – saves ₹2,000/night', saving: 2000 },
  { icon: '🚗', text: 'Share a cab for Nubra Valley – saves ₹1,500', saving: 1500 },
  { icon: '🎭', text: 'Skip paid monastery tour – free entry on weekdays', saving: 800 },
  { icon: '🍜', text: 'Eat at local dhabas instead of restaurants – saves ₹400/day', saving: 400 },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs shadow-xl">
        {payload.map(p => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-semibold">₹{p.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function BudgetAnalytics() {
  const pct = Math.round((SPENT / BUDGET) * 100)
  const remaining = BUDGET - SPENT

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow-border-amber p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(245,158,11,1), transparent 60%)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Smart Budget Analytics <span className="badge badge-amber">Live</span>
              </h1>
              <p className="text-slate-400">Real-time budget tracking with intelligent warnings</p>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Budget', value: `₹${BUDGET.toLocaleString()}`, icon: DollarSign, color: 'brand', sub: 'Himalayan Adventure' },
            { label: 'Amount Spent', value: `₹${SPENT.toLocaleString()}`, icon: TrendingDown, color: pct >= 80 ? 'amber' : 'emerald', sub: `${pct}% used` },
            { label: 'Remaining', value: `₹${remaining.toLocaleString()}`, icon: CheckCircle, color: remaining < 0 ? 'rose' : 'emerald', sub: remaining >= 0 ? 'On track' : 'Over budget!' },
          ].map(card => {
            const Icon = card.icon
            const c = { brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20', amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20', emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }[card.color]
            return (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
                <div className={`w-10 h-10 rounded-xl ${c} border flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-white">{card.value}</div>
                <div className="text-slate-400 text-sm">{card.label}</div>
                <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Overall Budget Usage</span>
            <span className={`text-lg font-bold ${pct >= 100 ? 'text-rose-400' : pct >= 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{pct}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className={`h-full rounded-full ${pct >= 100 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>₹0</span><span>₹{BUDGET.toLocaleString()}</span>
          </div>
        </div>

        {/* Warning Cards */}
        {warnings.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />Budget Warnings
            </h2>
            <div className="space-y-3">
              {warnings.map((w, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card glow-border-amber p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">⚠️ {w.day} exceeds budget by <span className="text-amber-400">₹{w.over.toLocaleString()}</span></p>
                    <p className="text-slate-400 text-xs">{w.city} · {w.type} expenses over limit</p>
                  </div>
                  <span className="badge badge-amber">Review</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-brand-400" />Day-wise Spending</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dayData} barGap={4}>
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget" name="Budget" fill="rgba(124,58,237,0.3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Cell key={index} fill={entry.spent > entry.budget ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-cyan-400" />Spending by Category</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={180}>
                <RechartsPie>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />Budget-Saving Suggestions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card p-4 flex items-start gap-3 hover:border-emerald-500/30 transition-all">
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">{s.text}</p>
                  <p className="text-emerald-400 text-xs mt-1 font-semibold">Save ₹{s.saving.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
