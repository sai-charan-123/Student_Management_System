import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const collegeApi = {
  getAll: (params) => api.get('/colleges/', { params }),
  getById: (id) => api.get(`/colleges/${id}/`),
  create: (data) => api.post('/colleges/', data),
  checkEligibility: (marks) => api.get('/colleges/check_eligibility/', { params: { marks } }),
};

export const courseApi = {
  getAll: (params) => api.get('/courses/', { params }),
  create: (data) => api.post('/courses/', data),
};

export const applicationApi = {
  getAll: (params) => api.get('/applications/', { params }),
  getById: (id) => api.get(`/applications/${id}/`),
  create: (data) => api.post('/applications/', data),
  track: (query) => api.get('/applications/track/', { params: { query } }),
  updateStatus: (id, data) => api.patch(`/applications/${id}/update_status/`, data),
};

export const statsApi = {
  getStats: () => api.get('/dashboard/stats/'),
};

export default api;

