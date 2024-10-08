import axios, { type AxiosInstance } from 'axios';
import { backendURL } from '../_constant/paths';

export const httpClient: AxiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});
