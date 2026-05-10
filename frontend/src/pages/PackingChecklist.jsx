import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, Trash2, PackageCheck, ShirtIcon } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

const CATEGORIES = [
  { id: 'clothing', label: 'Clothing', emoji: '👕' },
  { id: 'documents', label: 'Documents', emoji: '📄' },
  { id: 'electronics', label: 'Electronics', emoji: '💻' },
  { id: 'toiletries', label: 'Toiletries', emoji: '🧴' },
  { id: 'essentials', label: 'Travel Essentials', emoji: '🎒' },
]

const initialItems = [
  { id: '1', label: 'T-Shirts (5)', category: 'clothing', packed: false },
  { id: '2', label: 'Warm Jacket', category: 'clothing', packed: true },
  { id: '3', label: 'Passport', category: 'documents', packed: true },
  { id: '4', label: 'Travel Insurance Card', category: 'documents', packed: false },
  { id: '5', label: 'Laptop + Charger', category: 'electronics', packed: false },
  { id: '6', label: 'Power Bank', category: 'electronics', packed: true },
  { id: '7', label: 'Sunscreen SPF 50', category: 'toiletries', packed: false },
  { id: '8', label: 'First Aid Kit', category: 'essentials', packed: true },
  { id: '9', label: 'Altitude Sickness Medicine', category: 'essentials', packed: false },
  { id: '10', label: 'Water Bottle', category: 'essentials', packed: true },
]

export default function PackingChecklist() {
  const [items, setItems] = useState(initialItems)
  const [activeCategory, setActiveCategory] = useState('all')
  const [newItem, setNewItem] = useState('')
  const [newCategory, setNewCategory] = useState('essentials')

  const toggle = (id) => setItems(i => i.map(x => x.id === id ? { ...x, packed: !x.packed } : x))
  const remove = (id) => setItems(i => i.filter(x => x.id !== id))
  const add = () => {
    if (!newItem.trim()) return
    setItems(i => [...i, { id: Date.now().toString(), label: newItem, category: newCategory, packed: false }])
    setNewItem('')
  }

  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)
  const packedCount = items.filter(i => i.packed).length
  const pct = Math.round((packedCount / items.length) * 100)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#1e2d1f' }}><PackageCheck className="w-6 h-6 text-brand-500" />Packing Checklist</h1>
            <p className="text-slate-500 text-sm mt-1">{packedCount}/{items.length} items packed</p>
          </div>
        </div>

        {/* Progress */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold" style={{ color: '#1e2d1f' }}>Packing Progress</span>
            <span className={`text-lg font-bold ${pct === 100 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-brand-400'}`}>{pct}%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#dff3e3' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
              className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-brand-400'}`} />
          </div>
          {pct === 100 && <p className="text-emerald-400 text-sm mt-2 font-medium">🎉 All packed! Ready to go!</p>}
        </div>

        {/* Add Item */}
        <div className="glass-card p-4 flex gap-3 flex-wrap">
          <input placeholder="Add new item..." value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()} className="input-field flex-1 min-w-48 text-sm" id="checklist-new-item" />
          <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-field w-44 text-sm">
            {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-white text-slate-800">{c.emoji} {c.label}</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={add} className="btn-primary text-sm flex items-center gap-1.5 py-2.5 px-4">
            <Plus className="w-4 h-4" />Add
          </motion.button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${activeCategory === 'all' ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'glass border-white/10 text-slate-400 hover:text-white'}`}>
            All ({items.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = items.filter(i => i.category === cat.id).length
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${activeCategory === cat.id ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'glass border-white/10 text-slate-400 hover:text-white'}`}>
                {cat.emoji} {cat.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Items by Category */}
        {CATEGORIES.filter(c => activeCategory === 'all' || c.id === activeCategory).map(cat => {
          const catItems = filtered.filter(i => i.category === cat.id)
          if (catItems.length === 0) return null
          const catPacked = catItems.filter(i => i.packed).length
          return (
            <div key={cat.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2" style={{ color: '#1e2d1f' }}>
                  <span className="text-lg">{cat.emoji}</span>{cat.label}
                </h3>
                <span className="text-slate-400 text-xs">{catPacked}/{catItems.length}</span>
              </div>
              <div className="space-y-2">
                {catItems.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                      item.packed ? 'bg-leaf-light border-brand-200' : 'bg-white border-slate-200 hover:border-brand-200'
                    }`}>
                    <button onClick={() => toggle(item.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.packed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-brand-400'}`}>
                      {item.packed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-sm ${ item.packed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.label}</span>
                    <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
