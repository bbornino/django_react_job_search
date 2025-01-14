import { useNavigate } from 'react-router-dom'; // To redirect to login on failure
import { useState, useCallback } from 'react'; // Import useCallback
import { customFetch } from './customFetch'; // import customFetch

export function useApiRequest() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // Use useCallback to memoize apiRequest
  const apiRequest = useCallback(async (url, body = {}, options = {}) => {
    try {
      const response = await customFetch(url, { ...options, body }, accessToken, refreshToken, navigate);
      return response; // Return the response for use in components
    } catch (err) {
      setError(err.message); // Set error in case of failure
      console.error(err);
      return null;
    }
  }, [navigate, accessToken, refreshToken]); // Add these as dependencies to ensure stable memoization

  return { apiRequest, error };
}
