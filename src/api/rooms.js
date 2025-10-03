import api from './axios'

export const rooms = {
  all: (params = {}) => api.get('/rooms', { params }),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  destroy: (id) => api.delete(`/rooms/${id}`),
}
