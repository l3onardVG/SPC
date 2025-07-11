export const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' 
  ? (typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.hostname}:5197/api`
      : 'http://localhost:5197/api')
  : "http://localhost:5197/api");
