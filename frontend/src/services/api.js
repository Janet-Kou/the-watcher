import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
});

// This automatically attaches your Login Token (JWT) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('token/', credentials);
export const register = (userData) => api.post('register/', userData);
export const searchMovies = (query) => api.get(`search/?query=${query}`);
export const getWatchlist = () => api.get('watchlist/');
export const addToWatchlist = (movieData) => api.post('watchlist/', movieData);

export default api;