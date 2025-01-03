import axios from 'axios';
import { useAuthHeader } from 'react-auth-kit'; // For generating headers dynamically
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect to login on failure

export function useSetupAxiosInterceptor() {
  const getAuthHeader = useAuthHeader(); // Get the Authorization header function
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Setting up Axios interceptors');

    // Request Interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("access_token");
        console.log('Request Interceptor - Access Token:', accessToken);

        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // If the response is successful, return it as is
        console.log("AXIOS responseInterceptor is Successful.")
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Check if error is due to an expired token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          console.log('Token expired. Attempting to refresh token...');
          originalRequest._retry = true; // Prevent infinite retries

          try {
            // Send a request to refresh the token
            const refreshToken = localStorage.getItem("refresh_token");
            const response = await axios.post('/auth/refresh', {
              refresh_token: refreshToken,
            });

            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;

            // Save the new tokens in localStorage
            localStorage.setItem("access_token", newAccessToken);
            localStorage.setItem("refresh_token", newRefreshToken);

            // Update the original request with the new token and retry it
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Clear tokens and redirect to login
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate('/login'); // Redirect to login page
            return Promise.reject(refreshError);
          }
        }

        // If the error is not related to token expiration, reject it as is
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject interceptors when the component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [getAuthHeader, navigate]);

  return null;
}
