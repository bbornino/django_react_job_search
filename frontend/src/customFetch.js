import { TOKEN_REFRESH_API_URL } from "./constants";

export async function customFetch(url, options = {}, accessToken, refreshToken, navigate) {
  let isRefreshing = false; // Track if the token refresh process is ongoing

  try {
    // Helper function to refresh the token
    async function refreshAccessToken() {
      const response = await fetch(TOKEN_REFRESH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        // If refreshing fails, navigate to login
        navigate('/login');
        throw new Error('Failed to refresh access token');
      }

      const data = await response.json();
      return data.access;
    }

    // Set up headers with the access token
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    // Ensure the body is correctly included for POST/PUT methods
    const body = 
      (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE')
        ? JSON.stringify(options.body) : null;

    let response = await fetch(url, {
      ...options,
      headers,
      body, // Add the body to the request
    });

    if (response.status === 401 && refreshToken && !isRefreshing) {
      // Access token expired, start the refresh process
      isRefreshing = true;
      console.log('Access token expired, attempting to refresh...');
      
      try {
        const newAccessToken = await refreshAccessToken();
        
        // Save the new access token to localStorage
        localStorage.setItem('access_token', newAccessToken);

        // Retry the original request with the new access token
        const retryHeaders = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newAccessToken}`,
        };
        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        // Parse and return the JSON data from the retried response
        const retryData = await response.json();
        return retryData || [];
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
        navigate('/login'); // Navigate to login if refreshing fails
        return [];
      }
    }

    // For other non-401 errors, handle them as usual
    if (!response.ok && response.status !== 401) {

      // Log the error for non-401 statuses
      console.error(`HTTP Error: ${response.status} - ${response.statusText}`);

      // throw new Error(`HELP HTTP Error: ${response.status} - ${response.statusText}`);
    }

    // Handle empty or non-JSON response body
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return text.trim().length === 0 ? [] : [];
    }

    // Parse and return JSON data
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Custom fetch error:', error);
    return [];
  }
}
