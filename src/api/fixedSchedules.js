import api from './axios'

export const fixedSchedules = {
  all: (params = {}) => api.get('/fixed-schedules', { params }),
  create: (data) => api.post('/fixed-schedules', data),
  update: (id, data) => api.put(`/fixed-schedules/${id}`, data),
  destroy: (id) => api.delete(`/fixed-schedules/${id}`),
}
