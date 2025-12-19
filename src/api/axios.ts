import axios from 'axios';
import { getAccessToken } from '../auth/tokenStore';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/rest`;

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers?.set('Authorization', `Bearer ${token}`);
  }

  return config;
});
