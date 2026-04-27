import api from './axios.js';

export const predictDiseases = async (symptomIds) => {
  try {
    const res = await api.post('/api/predict', { symptoms: symptomIds }, {withCredentials : true});
    return res?.data;
  } catch (err) {
    // Bubble up the most useful error message for the UI.
    const message =
      err.response?.data?.message ||
      err.message ||
      'Prediction request failed';
    const status = err.response?.status;
    const error = new Error(message);
    error.status = status;
    throw error;
  }
};

