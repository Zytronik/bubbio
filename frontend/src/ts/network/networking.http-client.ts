import axios, { AxiosInstance } from 'axios';
import { backendURL } from './paths';

export const httpClient: AxiosInstance = axios.create({
    baseURL: backendURL,
    withCredentials: true
});