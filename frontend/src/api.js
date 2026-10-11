import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const customerApi = {
  list: (search = '') => api.get('/customers', { params: search ? { search } : {} }),
  create: (customer) => api.post('/customers', customer),
  update: (id, customer) => api.put(`/customers/${id}`, customer),
  remove: (id) => api.delete(`/customers/${id}`),
};
