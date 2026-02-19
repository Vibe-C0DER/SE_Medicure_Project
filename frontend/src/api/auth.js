import api from './axios.js';

export const signup = (data) =>
  api.post('/api/auth/signup', data);

export const signin = (data) =>
  api.post('/api/auth/signin', data);

export const signOut = () =>
  api.get('/api/auth/signout');
