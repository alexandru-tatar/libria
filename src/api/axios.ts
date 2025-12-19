import axios from 'axios';
import { keycloak } from '../auth/keycloak';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/rest`;

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = keycloak.token;

  if (token) {
    config.headers?.set('Authorization', `Bearer ${token}`);
  }

  return config;
});