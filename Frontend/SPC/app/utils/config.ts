export const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' 
  ? "http://localhost:5197/api"  // Use localhost for browser access
  : "http://localhost:5197/api");
