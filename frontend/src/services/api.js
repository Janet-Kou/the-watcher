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
export const searchMovies = (queryString) => api.get(`search/?${queryString}`);
export const getTrendingMovies = () => api.get('movies/trending/');
export const getSuggestedMovies = () => api.get('movies/suggested/');
export const getCatalogMovies = () => api.get('catalog/');
export const getWatchlist = () => {
    const token = localStorage.getItem('token');
    return api.get('/watchlist/', {
        headers: { Authorization: `Bearer ${token}` }
    });
};
export const addToWatchlist = (movieData) => {
    const token = localStorage.getItem('token'); 
    
    console.log("Sending token:", token);

    return api.post('/watchlist/', movieData, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const requestPasswordReset = (email) => api.post('password-reset/', { email });
export const confirmPasswordReset = (uid, token, new_password) => api.post('password-reset-confirm/', { uid, token, new_password });

export default api;