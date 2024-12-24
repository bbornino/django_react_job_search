import axios from 'axios';

// Get the base URL from the environment variable
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Dynamically get the URL from the .env file
});

// Check if authentication is enabled
const enableAuth = process.env.REACT_APP_ENABLE_AUTH === 'true';

// Add a request interceptor to include the JWT token in the request headers if auth is enabled
axiosInstance.interceptors.request.use(
    (config) => {
        if (enableAuth) {
            const token = localStorage.getItem('access_token'); // Get the token from localStorage

            if (token && token !== 'undefined' && token !== 'null') {
                config.headers['Authorization'] = `Bearer ${token}`; // Attach token in Authorization header
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios instance will always return an Axios object configured for both scenarios
export default axiosInstance;
