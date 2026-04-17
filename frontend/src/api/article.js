import api from './axios.js';

export const fetchArticleByDiseaseId = (diseaseId) => api.get(`/api/articles/disease/${diseaseId}`);

export const fetchArticleById = (articleId) => api.get(`/api/articles/${articleId}`);
