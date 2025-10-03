import api from './axios'

export const auth = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  profile: () => api.get('/profile'), // sesuai Laravel
  updateProfile: (data) => api.put('/profile', data),
  logout: () => api.post('/logout'),
}
