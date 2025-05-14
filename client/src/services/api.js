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

export function getTopImportantNews(news) {
  return api.post('/news/top-important', { news });
}

export async function fetchCompanyDescription(companyName) {
  const res = await fetch('/api/company/describe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName }),
  });
  if (!res.ok) throw new Error('Failed to fetch company description');
  const data = await res.json();
  return { description: data.description, companyName: data.companyName };
}

export default api; 