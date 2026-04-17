import api from './axios';

export const getAllArticles = async () => {
    return await api.get('/api/articles');
};

export const getArticleById = async (id) => {
    return await api.get(`/api/articles/${id}`);
};

export const getArticleByDiseaseId = async (diseaseId) => {
    return await api.get(`/api/articles/disease/${diseaseId}`);
};
