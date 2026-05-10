import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, BookOpen, Clock, Save, X } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

const NOTE_COLORS = ['from-brand-500/20 to-brand-600/10 border-brand-500/20',
  'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
  'from-amber-500/20 to-amber-600/10 border-amber-500/20',
  'from-rose-500/20 to-rose-600/10 border-rose-500/20',
  'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
]

const initialNotes = [
  { id: '1', title: 'Packing Reminder', content: 'Don\'t forget altitude sickness medicine for Leh. Buy Diamox from pharmacy before leaving.', date: '2024-05-28', trip: 'Himalayan Adventure', colorIdx: 0 },
  { id: '2', title: 'Hotel Contact', content: 'Hotel Himalayan: +91 98765 43210. Check-in at 2PM. Ask for mountain view room.', date: '2024-05-27', trip: 'Himalayan Adventure', colorIdx: 1 },
  { id: '3', title: 'Local Tips', content: 'Best cafe in Old Manali: Drifters Cafe. Try the Tibetan Thukpa. Open till 10PM.', date: '2024-05-25', trip: 'Himalayan Adventure', colorIdx: 2 },
  { id: '4', title: 'Emergency Contacts', content: 'Travel insurance: 1800-xxx-xxxx. Local emergency: 112. Tour guide: Raj +91 87654 32109', date: '2024-05-20', trip: 'Himalayan Adventure', colorIdx: 3 },
]

export default function TripNotes() {
  const [notes, setNotes] = useState(initialNotes)
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })

  const deleteNote = (id) => setNotes(n => n.filter(x => x.id !== id))
  const saveEdit = (id, updated) => {
    setNotes(n => n.map(x => x.id === id ? { ...x, ...updated } : x))
    setEditing(null)
  }
  const addNote = () => {
    if (!newNote.title.trim()) return
    setNotes(n => [{
      id: Date.now().toString(), ...newNote,
      date: new Date().toISOString().split('T')[0], trip: 'Himalayan Adventure', colorIdx: Math.floor(Math.random() * NOTE_COLORS.length)
    }, ...n])
    setNewNote({ title: '', content: '' })
    setAdding(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><BookOpen className="w-6 h-6 text-amber-500" />Trip Notes</h1>
            <p className="text-slate-500 text-sm mt-1">{notes.length} notes · Himalayan Adventure</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Add Note
          </motion.button>
        </div>

        {/* Add Note */}
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow-border p-5">
            <h3 className="text-slate-900 font-semibold mb-3">New Note</h3>
            <input placeholder="Note title..." value={newNote.title} onChange={e => setNewNote(n => ({ ...n, title: e.target.value }))}
              className="input-field mb-3" />
            <textarea placeholder="Write your note..." value={newNote.content} onChange={e => setNewNote(n => ({ ...n, content: e.target.value }))}
              className="input-field resize-none mb-3" rows={3} />
            <div className="flex gap-2">
              <button onClick={addNote} className="btn-primary text-sm flex items-center gap-1"><Save className="w-4 h-4" />Save</button>
              <button onClick={() => setAdding(false)} className="btn-secondary text-sm flex items-center gap-1"><X className="w-4 h-4" />Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notes.map((note, i) => (
            <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className={`relative group rounded-2xl border bg-gradient-to-br p-5 ${NOTE_COLORS[note.colorIdx]} backdrop-blur-sm`}>
              {/* Actions */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(note.id)} className="p-1.5 rounded-lg bg-white/50 hover:bg-white text-slate-500 hover:text-slate-900 shadow-sm transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteNote(note.id)} className="p-1.5 rounded-lg bg-white/50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 shadow-sm transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {editing === note.id ? (
                <EditNoteForm note={note} onSave={saveEdit} onCancel={() => setEditing(null)} />
              ) : (
                <>
                  <h3 className="text-slate-900 font-bold text-base mb-2 pr-12">{note.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">{note.content}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Clock className="w-3 h-3" />{note.date}
                    <span className="badge badge-purple ml-1">{note.trip}</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

function EditNoteForm({ note, onSave, onCancel }) {
  const [form, setForm] = useState({ title: note.title, content: note.content })
  return (
    <div className="space-y-2">
      <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field text-sm" />
      <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="input-field text-sm resize-none" rows={3} />
      <div className="flex gap-2">
        <button onClick={() => onSave(note.id, form)} className="btn-primary text-xs py-1.5 flex items-center gap-1"><Save className="w-3 h-3" />Save</button>
        <button onClick={onCancel} className="btn-secondary text-xs py-1.5"><X className="w-3 h-3" /></button>
      </div>
    </div>
  )
}
