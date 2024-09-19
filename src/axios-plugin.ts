import { App } from 'vue';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('AccessToken') || '';
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
});

export default {
    install: (app: App) => {
        app.config.globalProperties.$axios = axiosInstance;
    }
};