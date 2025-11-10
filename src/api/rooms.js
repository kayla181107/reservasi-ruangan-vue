import api from './axios'

export const rooms = {
  all: (params = {}) => api.get('/rooms', { params }),
  create: (data) => api.post('/admin/rooms', data),
  get: (id) => api.get(`/rooms/${id}`),
  update: (id, data) => api.put(`/admin/rooms/${id}`, data),
  destroy: (id) => api.delete(`/admin/rooms/${id}`),
}
