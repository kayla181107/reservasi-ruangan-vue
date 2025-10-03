import api from './axios'

export const reservations = {
  all: (params = {}) => api.get('/reservations', { params }),

  approve(id, reason) {
    return api.put(`/reservations/${id}`, { status: 'approved', reason })
  },

  reject(id, reason) {
    return api.put(`/reservations/${id}`, { status: 'rejected', reason })
  },

  destroy: (id) => api.delete(`/reservations/${id}`),
}
