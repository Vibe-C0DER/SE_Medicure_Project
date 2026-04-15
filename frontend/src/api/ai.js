import api from './axios';

export const aiApi = {
  analyzeText: async (text) => {
    const response = await api.post('/api/ai/analyze', { text }, {withCredentials: true});
    return response.data;
  },
};
