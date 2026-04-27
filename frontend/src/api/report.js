import api from './axios.js';

export const getMyReports = async () => {
  const response = await api.get('/api/reports/me');
  return response.data;
};

export const getReportById = async (id) => {
  const response = await api.get(`/api/reports/${id}`);
  return response.data;
};

export const downloadReportPDF = async (id) => {
  const response = await api.get(`/api/reports/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getAllReportsAdmin = async (page = 1, limit = 10, email = '') => {
  const response = await api.get('/api/admin/reports', {
    params: { page, limit, email },
  });
  return response.data;
};
