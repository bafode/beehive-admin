import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL:'https://beehive-api.fr/v1'
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add authorization token to headers if available
        const token = localStorage.getItem('token');
        config.withCredentials = true;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
