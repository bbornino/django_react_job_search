// useApiRequest.js

import { useNavigate } from 'react-router-dom'; // To redirect to login on failure
import { useEffect, useState } from 'react';
import { customFetch } from './customFetch'; // import customFetch

export function useApiRequest() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const request = async (url, options = {}) => {
    try {
      const response = await customFetch(url, options, accessToken, refreshToken, navigate);
      return response; // You can return the response here for use in components
    } catch (err) {
      setError(err.message); // Set error in case of failure
      console.error(err);
      return null;
    }
  };

  return { request, error };
}
