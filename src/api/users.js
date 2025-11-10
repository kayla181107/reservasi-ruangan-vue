import axios from "axios";

// Ganti baseURL sesuai backend Laravel-mu
const api = axios.create({
  baseURL: "http://localhost:8000", // misal Laravel berjalan di port 8000
  headers: {
    "Content-Type": "application/json",
  },
});

export const users = {
  all: (params = {}) => api.get("/api/admin/users", { params }),
  show: (id) => api.get(`/api/admin/users/${id}`),
  store: (data) => api.post("/api/admin/users", data),
  update: (id, data) => api.put(`/api/admin/users/${id}`, data),
  destroy: (id) => api.delete(`/api/admin/users/${id}`),
};
