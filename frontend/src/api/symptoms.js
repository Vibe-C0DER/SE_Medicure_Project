import api from './axios.js';

export const fetchSymptoms = () => api.get('/api/symptoms');

export const fetchSymptomById = (id) => api.get(`/api/symptoms/${id}`);

