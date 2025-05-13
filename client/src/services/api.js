import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // headers, interceptors, etc. eklenebilir
});

// News endpoints
export const getNews = (ticker) => api.get(`/news?ticker=${ticker}`);

// AI endpoints
export const interpretNews = (data) => api.post('/ai/interpret', data);
export const interpretNewsFromLink = (data) => api.post('/ai/interpret-link', data);

export default api; 