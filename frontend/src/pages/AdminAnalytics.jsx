import { motion } from 'framer-motion'
import { Users, Map, Globe, TrendingUp, BarChart2, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'

const userGrowth = [
  { month: 'Jan', users: 800 }, { month: 'Feb', users: 1200 }, { month: 'Mar', users: 1800 },
  { month: 'Apr', users: 2400 }, { month: 'May', users: 3200 }, { month: 'Jun', users: 4100 },
]

const topDests = [
  { name: 'Bali', trips: 890 }, { name: 'Manali', trips: 760 }, { name: 'Goa', trips: 640 },
  { name: 'Kerala', trips: 520 }, { name: 'Rajasthan', trips: 490 },
]

const stats = [
  { label: 'Total Users', value: '12,400', icon: Users, color: 'brand', change: '+18% this month' },
  { label: 'Total Trips', value: '50,200', icon: Map, color: 'cyan', change: '+23% this month' },
  { label: 'Countries', value: '87', icon: Globe, color: 'emerald', change: '12 new this year' },
  { label: 'Avg Budget', value: '₹68K', icon: TrendingUp, color: 'amber', change: 'Per trip' },
]

const colorMap = {
  brand:   'text-brand-500 bg-leaf-light border-brand-200',
  cyan:    'text-cyan-600 bg-cyan-50 border-cyan-200',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  amber:   'text-amber-600 bg-amber-50 border-amber-200',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-slate-500 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} className="font-semibold" style={{ color: '#1e2d1f' }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

export default function AdminAnalytics() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-leaf-light border border-brand-200 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-brand-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e2d1f' }}>Admin Analytics</h1>
            <p className="text-slate-500 text-sm">Platform overview and engagement metrics</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => {
            const Icon = stat.icon
            const c = colorMap[stat.color]
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
                <div className={`w-10 h-10 rounded-xl ${c} border flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black" style={{ color: '#1e2d1f' }}>{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
                <div className="text-xs text-emerald-400 mt-1">{stat.change}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}><Activity className="w-4 h-4 text-brand-500" />User Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" stroke="#4CAF50" strokeWidth={2.5} dot={{ fill: '#4CAF50', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Destinations */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1e2d1f' }}><Globe className="w-4 h-4 text-cyan-500" />Top Destinations</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topDests} layout="vertical">
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="trips" fill="rgba(76,175,80,0.5)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { user: 'Riya P.', action: 'Created trip', detail: 'Bali Spirit Tour', time: '2 min ago', avatar: 'R' },
              { user: 'Karan M.', action: 'Used AI Optimizer', detail: 'Generated Manali plan', time: '5 min ago', avatar: 'K' },
              { user: 'Dev S.', action: 'Shared trip', detail: 'Thailand Island Hop', time: '12 min ago', avatar: 'D' },
              { user: 'Anika R.', action: 'Budget warning triggered', detail: 'Day 3 over budget', time: '18 min ago', avatar: 'A' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{item.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: '#1e2d1f' }}><span className="font-semibold">{item.user}</span> {item.action}</p>
                  <p className="text-slate-500 text-xs truncate">{item.detail}</p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
