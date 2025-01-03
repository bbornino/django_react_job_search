export async function customFetch(url, options = {}, accessToken, refreshToken, navigate) {
    try {
      // Set up the headers with Authorization token
      const headers = {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(refreshToken && { 'X-Refresh-Token': refreshToken })
      };
  
      const response = await fetch(url, {
        ...options,
        headers,
      });
  
      // Check for the status codes
      if (!response.ok) {
        // Handle non-OK status codes (e.g., 404, 500)
        if (response.status === 401 || response.status === 403) {
          // Handle unauthorized access (e.g., navigate to login page)
          navigate('/login');
        }
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
  
      // Check for empty response body and handle gracefully
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON responses (like HTML error pages or empty responses)
        const text = await response.text();
        if (text.trim().length === 0) {
          // Return empty object/array to indicate "no data"
          return [];
        }
        // If it's HTML, handle as an error page (you can adjust based on your needs)
        if (text.startsWith('<!DOCTYPE html>')) {
          return []; // Return an empty array for HTML error pages
        }
        // If it's unexpected content, return empty array
        return [];
      }
  
      // If it's a JSON response, parse it
      const data = await response.json();
      
      // Return the parsed JSON data (or empty array if data is null/undefined)
      return data || [];
  
    } catch (error) {
      console.error('Custom fetch error:', error);
      // You can return an empty array or an empty object here to gracefully handle the error
      return [];
    }
  }
  