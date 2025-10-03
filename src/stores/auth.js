import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/login', {
          email,
          password,
        })

        this.token = res.data.token
        localStorage.setItem('token', this.token)

        await this.getProfile()
        return true
      } catch (err) {
        console.error(err.response?.data || err.message)
        return false
      }
    },

    async getProfile() {
      if (!this.token) return

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/profile', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        this.user = res.data // harus ada role dari backend
      } catch (err) {
        console.error('Gagal ambil profil:', err.response?.data || err.message)
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
