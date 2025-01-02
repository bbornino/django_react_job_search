import { useAuthUser } from 'react-auth-kit'; // Import from the package
import { useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios

// Custom hook to set up the Axios interceptor
export function useSetupAxiosInterceptor() {
  const authUser = useAuthUser(); // Get the current user from auth-kit
  console.log('Starting useSetupAxiosInterceptor ');
  debugger
  useEffect(() => {
    console.log('Starting useSetupAxiosInterceptor');
    debugger;

    const interceptor = axios.interceptors.request.use(
      (config) => {
        debugger;
        const accessToken = localStorage.getItem("access_token");
        console.log('Interceptor Access token:', accessToken);

        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject interceptor when component unmounts
    return () => axios.interceptors.request.eject(interceptor);
  }, []);
  return null;
}