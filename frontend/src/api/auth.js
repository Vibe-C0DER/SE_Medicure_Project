import api from './axios.js';

export const signup = (data) =>
  api.post('/api/auth/signup', data);

export const signin = (data) =>
  api.post('/api/auth/signin', data);

export const signOut = () =>
  api.get('/api/auth/signout');

export const googleSignIn = (data) =>
  api.post('/api/auth/google', data);

export const forgotPassword = (data) =>
  api.post('/api/auth/forgot-password', data);

export const resetPassword = (token, data) =>
  api.post(`/api/auth/reset-password/${token}`, data);

