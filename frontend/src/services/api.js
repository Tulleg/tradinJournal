import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const getTrades = () => api.get('/trades');
export const createTrade = (tradeData) => api.post('/trades', tradeData);
export const updateTrade = (id, tradeData) => api.put(`/trades/${id}`, tradeData);
export const deleteTrade = (id) => api.delete(`/trades/${id}`);
export const register = (userData) => api.post('/auth/register', userData);
export const resetPasswordRequest = (email) => api.post('/auth/reset-password-request', email);
export const logout = () => {
  localStorage.removeItem('token');
};
export const getTradeCount = async () => {
  try {
    const response = await api.get('/trades/count');
    return response.data.count;
  } catch (error) {
    console.error('Fehler beim Abrufen der Trade-Anzahl:', error);
  }
};
export const updateTrade = (id, tradeData) => api.put(`/trades/${id}`, tradeData);


export default api;
