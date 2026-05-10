const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export const getToken = () => localStorage.getItem('traveloop_token')

export const setToken = (token) => {
  if (token) localStorage.setItem('traveloop_token', token)
}

export const clearToken = () => {
  localStorage.removeItem('traveloop_token')
  localStorage.removeItem('traveloop_user')
}

const safeJson = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : {}
}

export const request = async (path, options = {}) => {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }

  const token = options.token ?? getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await safeJson(response)

  if (!response.ok) {
    const message = data?.message || data?.error || 'Request failed'
    throw new Error(message)
  }

  return data
}

// Auth
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body, token: '' }),
  login: (body) => request('/auth/login', { method: 'POST', body, token: '' }),
  me: () => request('/auth/me'),
}

// Trips
export const tripApi = {
  list: () => request('/trips'),
  get: (id) => request(`/trips/${id}`),
  create: (body) => request('/trips', { method: 'POST', body }),
  update: (id, body) => request(`/trips/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/trips/${id}`, { method: 'DELETE' }),
  joinBySlug: (shareSlug) => request(`/trips/join/${shareSlug}`, { method: 'POST' }),
  members: (tripId) => request(`/trips/${tripId}/members`),
  addMember: (tripId, body) => request(`/trips/${tripId}/members`, { method: 'POST', body }),
  removeMember: (tripId, memberUserId) => request(`/trips/${tripId}/members/${memberUserId}`, { method: 'DELETE' }),
  notes: (tripId) => request(`/trips/${tripId}/notes`),
  createNote: (tripId, body) => request(`/trips/${tripId}/notes`, { method: 'POST', body }),
  updateNote: (noteId, body) => request(`/trips/notes/${noteId}`, { method: 'PUT', body }),
  removeNote: (noteId) => request(`/trips/notes/${noteId}`, { method: 'DELETE' }),
  packingItems: (tripId) => request(`/trips/${tripId}/packing-items`),
  createPackingItem: (tripId, body) => request(`/trips/${tripId}/packing-items`, { method: 'POST', body }),
  updatePackingItem: (itemId, body) => request(`/trips/packing-items/${itemId}`, { method: 'PUT', body }),
  removePackingItem: (itemId) => request(`/trips/packing-items/${itemId}`, { method: 'DELETE' }),
}

// Stops
export const stopApi = {
  list: (tripId) => request(`/stops?trip_id=${encodeURIComponent(tripId)}`),
  get: (id) => request(`/stops/${id}`),
  create: (body) => request('/stops', { method: 'POST', body }),
  update: (id, body) => request(`/stops/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/stops/${id}`, { method: 'DELETE' }),
}

// Expenses
export const expenseApi = {
  listByTrip: (tripId) => request(`/expenses?trip_id=${encodeURIComponent(tripId)}`),
  listByStop: (stopId) => request(`/expenses?stop_id=${encodeURIComponent(stopId)}`),
  summary: (tripId, totalBudget) => request(`/expenses/${tripId}/summary?total_budget=${encodeURIComponent(totalBudget)}`),
  create: (body) => request('/expenses', { method: 'POST', body }),
  update: (id, body) => request(`/expenses/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
}

// Search
export const searchApi = {
  cities: (query) => request(`/search/cities?q=${encodeURIComponent(query || '')}`),
  cityDetails: (name) => request(`/search/cities/${encodeURIComponent(name)}`),
  activities: (query) => request(`/search/activities?q=${encodeURIComponent(query || '')}`),
  trending: () => request('/search/trending'),
  recommendations: (params = {}) => {
    const search = new URLSearchParams()
    if (params.budget !== undefined) search.set('budget', params.budget)
    if (params.interests?.length) search.set('interests', params.interests.join(','))
    if (params.duration !== undefined) search.set('duration', params.duration)
    return request(`/search/recommendations?${search.toString()}`)
  },
}

// Activities
export const activityApi = {
  listByStop: (stopId) => request(`/extras/activities?stop_id=${encodeURIComponent(stopId)}`),
  get: (id) => request(`/extras/activities/${id}`),
  create: (body) => request('/extras/activities', { method: 'POST', body }),
  update: (id, body) => request(`/extras/activities/${id}`, { method: 'PUT', body }),
  complete: (id) => request(`/extras/activities/${id}/complete`, { method: 'PATCH' }),
  remove: (id) => request(`/extras/activities/${id}`, { method: 'DELETE' }),
}
