import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (data: { name: string; slug: string; description?: string }) => {
  const response = await api.post('/categories', data);
  return response.data;
};
