import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
};

export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  getMyListings: () => api.get('/listings/my-listings'),
  getFavorites: () => api.get('/listings/favorites'),
  toggleFavorite: (id) => api.post(`/listings/${id}/favorite`),
};

export const predictionsAPI = {
  predict: (data) => api.post('/predict', data),
  getHistory: () => api.get('/predictions/history'),
  getStats: () => api.get('/predictions/stats'),
};

export const datasetAPI = {
  upload: (formData) => api.post('/dataset/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  train: (data) => api.post('/model/train', data),
  getMetrics: () => api.get('/model/metrics'),
  getHistory: () => api.get('/model/history'),
  getDatasets: () => api.get('/datasets'),
  getAnalytics: () => api.get('/analytics'),
};

export default api;
