import api from './axios';

export const createContactMessage = (data) => api.post('/api/contact', data);

