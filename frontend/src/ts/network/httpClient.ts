import axios, { type AxiosInstance } from 'axios';
import { backendURL } from '../_constant/paths';

export const httpClient: AxiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
