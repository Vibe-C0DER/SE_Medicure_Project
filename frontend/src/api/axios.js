import axios from 'axios';

const api = axios.create({
  // Prefer Vite dev-proxy (relative /api) to avoid CORS/cookie issues.
  // If you set VITE_API_URL, it will be used (e.g. production URL).
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
