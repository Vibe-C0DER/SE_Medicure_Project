import api from './axios.js';

export const getMe = () => api.get('/api/users/me');

export const updateMe = (data) => api.patch('/api/users/me', data);

