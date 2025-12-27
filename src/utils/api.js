import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://backend-5v8g.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Books API
export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`)
};

// Reviews API
export const reviewsAPI = {
  getByBook: (bookId) => api.get(`/reviews/book/${bookId}`),
  getUserReviews: () => api.get('/reviews/user'),
  create: (bookId, data) => api.post(`/reviews/book/${bookId}`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
};

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
