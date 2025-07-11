export const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' 
  ? `${window.location.protocol}//${window.location.hostname}:5197/api`  // Use current hostname
  : "http://localhost:5197/api");
