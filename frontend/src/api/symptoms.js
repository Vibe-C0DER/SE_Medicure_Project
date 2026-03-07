import api from './axios.js';

export const fetchSymptoms = () => api.get('/api/symptoms');

export const fetchSymptomById = (id) => api.get(`/api/symptoms/${id}`);

export const createSymptom = (data) => api.post('/api/symptoms/', data, {withCredentials : true});

