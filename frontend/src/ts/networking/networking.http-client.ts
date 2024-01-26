import axios, { AxiosInstance } from 'axios';


const host: string = window.location.host;
export let httpClient: AxiosInstance;

if (host === "localhost:8080") {
    httpClient = axios.create({
        baseURL: 'http://localhost:3000',
        withCredentials: true
    });
}else{
    httpClient = axios.create({
        baseURL: 'https://blubb.io/blubbio-backend/',
        withCredentials: true
    });
}