import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getMyReports = async () => {
  const response = await axios.get(`${API_URL}/reports/me`, { withCredentials: true });
  return response.data;
};

export const getReportById = async (id) => {
  const response = await axios.get(`${API_URL}/reports/${id}`, { withCredentials: true });
  return response.data;
};

export const downloadReportPDF = async (id) => {
  const response = await axios.get(`${API_URL}/reports/${id}/pdf`, {
    responseType: 'blob',
    withCredentials: true,
  });
  return response.data;
};

export const getAllReportsAdmin = async (page = 1, limit = 10, email = '') => {
  const response = await axios.get(`${API_URL}/admin/reports`, {
    params: { page, limit, email },
    withCredentials: true,
  });
  return response.data;
};
