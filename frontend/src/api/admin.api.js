import api from './axios';

// Diseases
export const getAdminDiseases = () => api.get('/api/admin/diseases');
export const createDisease = (data) => api.post('/api/admin/diseases', data);
export const updateDisease = (id, data) => api.put(`/api/admin/diseases/${id}`, data);
export const deleteDisease = (id) => api.delete(`/api/admin/diseases/${id}`);

// Symptoms
export const getAdminSymptoms = () => api.get('/api/admin/symptoms');
export const createSymptom = (data) => api.post('/api/admin/symptoms', data);
export const updateSymptom = (id, data) => api.put(`/api/admin/symptoms/${id}`, data);
export const deleteSymptom = (id) => api.delete(`/api/admin/symptoms/${id}`);

// Articles
export const getAdminArticles = () => api.get('/api/admin/articles');
export const createArticle = (data) => api.post('/api/admin/articles', data);
export const updateArticle = (id, data) => api.put(`/api/admin/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/api/admin/articles/${id}`);

// Reports
export const getAdminReports = (page = 1, limit = 10) => api.get(`/api/admin/reports?page=${page}&limit=${limit}`);
export const deleteReport = (id) => api.delete(`/api/admin/reports/${id}`);

// Dashboard
export const getDashboardStats = () => api.get('/api/admin/dashboard/stats');
export const getRecentActivity = () => api.get('/api/admin/dashboard/recent');

// Users
export const getAdminUsers = (page = 1, search = '') =>
  api.get(`/api/admin/users?page=${page}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ''}`);
export const updateUserRole = (id, role) => api.put(`/api/admin/users/${id}/role`, { role });
export const updateUserStatus = (id, isActive) => api.put(`/api/admin/users/${id}/status`, { isActive });
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);

// Contact Messages
export const getAdminContactMessages = () => api.get('/api/admin/contact');
export const markContactMessageRead = (id) => api.put(`/api/admin/contact/${id}/read`);
export const deleteContactMessage = (id) => api.delete(`/api/admin/contact/${id}`);

