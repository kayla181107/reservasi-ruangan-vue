import axios from './axios'

export const reservations = {
  all() {
    return axios.get('/reservations')
  },
  approve(id, reason = '') {
    return axios.put(`/admin/reservations/${id}/approve`, { reason })
  },
  reject(id, reason) {
    return axios.put(`/admin/reservations/${id}/rejected`, { reason })
  },
  destroy(id) {
    return axios.delete(`/admin/reservations/${id}`)
  },
}
