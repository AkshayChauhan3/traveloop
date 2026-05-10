import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, BookOpen, Clock, Save, X, RefreshCw } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { tripApi } from '../lib/api'

const NOTE_COLORS = [
  'from-brand-500/20 to-brand-600/10 border-brand-500/20',
  'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
  'from-amber-500/20 to-amber-600/10 border-amber-500/20',
  'from-rose-500/20 to-rose-600/10 border-rose-500/20',
  'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
]

export default function TripNotes() {
  const [trips, setTrips] = useState([])
  const [tripId, setTripId] = useState('')
  const [notes, setNotes] = useState([])
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setMessage('')
    try {
      const result = await tripApi.list()
      const allTrips = result.data || []
      setTrips(allTrips)
      const selectedId = tripId || allTrips[0]?.id
      if (selectedId) {
        setTripId(String(selectedId))
        const notesResult = await tripApi.notes(selectedId)
        setNotes(notesResult.data || [])
      } else {
        setNotes([])
      }
    } catch (err) {
      setMessage(err.message || 'Unable to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [tripId])

  const deleteNote = async (id) => {
    setMessage('')
    try {
      await tripApi.removeNote(id)
      await load()
    } catch (err) {
      setMessage(err.message || 'Unable to delete note')
    }
  }

  const saveEdit = async (id, updated) => {
    setMessage('')
    try {
      await tripApi.updateNote(id, updated)
      setEditing(null)
      await load()
    } catch (err) {
      setMessage(err.message || 'Unable to update note')
    }
  }

  const addNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return
    setMessage('')
    try {
      await tripApi.createNote(tripId, { title: newNote.title, content: newNote.content })
      setNewNote({ title: '', content: '' })
      setAdding(false)
      await load()
    } catch (err) {
      setMessage(err.message || 'Unable to add note')
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><BookOpen className="w-6 h-6 text-amber-500" />Trip Notes</h1>
            <p className="text-slate-500 text-sm mt-1">{notes.length} notes · {trips.find(t => String(t.id) === tripId)?.title || 'Select a trip'}</p>
          </div>
          <div className="flex gap-2">
            <select value={tripId} onChange={(e) => setTripId(e.target.value)} className="input-field w-56 text-sm">
              {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}
            </select>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />Add Note
            </motion.button>
            <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {message && <div className="glass-card p-4 text-sm text-rose-600 bg-rose-50 border-rose-200">{message}</div>}

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

        {loading ? (
          <div className="glass-card p-8 text-center text-slate-500">Loading notes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {notes.map((note, i) => (
              <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className={`relative group rounded-2xl border bg-gradient-to-br p-5 ${NOTE_COLORS[i % NOTE_COLORS.length]} backdrop-blur-sm`}>
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
                    <h3 className="text-slate-900 font-bold text-base mb-2 pr-12">{note.title || 'Untitled note'}</h3>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">{note.content}</p>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock className="w-3 h-3" />{new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function EditNoteForm({ note, onSave, onCancel }) {
  const [form, setForm] = useState({ title: note.title || '', content: note.content || '' })
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
