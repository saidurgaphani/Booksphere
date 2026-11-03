import axios from 'axios';

// The Vite dev server proxies /api to http://localhost:8000/api
// If accessed directly without proxy, fallback to http://localhost:8000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Dashboard
export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

// Books
export const getBooks = async (params = {}) => {
  const response = await api.get('/books', { params });
  return response.data;
};

export const getBook = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const updateProgress = async (id, payload) => {
  const response = await api.post(`/books/${id}/progress`, payload);
  return response.data;
};

export const getBookNotes = async (id) => {
  const response = await api.get(`/books/${id}/notes`);
  return response.data;
};

export const createBookNote = async (id, noteData) => {
  const response = await api.post(`/books/${id}/notes`, noteData);
  return response.data;
};

export const getBookAIInsights = async (id) => {
  const response = await api.post(`/books/${id}/ai-insights`);
  return response.data;
};

// Notes
export const getNotes = async (params = {}) => {
  const response = await api.get('/notes', { params });
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

// Insights
export const getInsights = async () => {
  const response = await api.get('/insights');
  return response.data;
};

// AI Recommendations
export const getRecommendations = async (payload) => {
  const response = await api.post('/recommendations', payload);
  return response.data;
};

// History
export const getHistory = async (limit) => {
  const response = await api.get('/history', { params: { limit } });
  return response.data;
};

// Export Reports
export const exportReportUrl = (format = 'csv') => {
  return `${API_BASE_URL}/reports/export?format=${format}`;
};

// Settings
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const saveSettings = async (settings) => {
  const response = await api.post('/settings', settings);
  return response.data;
};

// Helper: Open Library public search for metadata autofill
export const searchOpenLibrary = async (query) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`,
      { timeout: 5000 }
    );
    if (!res.data || !res.data.docs) return [];
    return res.data.docs.map((doc) => ({
      title: doc.title,
      author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
      genre: doc.subject ? doc.subject[0] : 'General',
      total_pages: doc.number_of_pages_median || 320,
      cover_image: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
      description: doc.first_sentence ? doc.first_sentence[0] : '',
    }));
  } catch (err) {
    console.warn('Open Library search unavailable:', err);
    return [];
  }
};

export default api;

