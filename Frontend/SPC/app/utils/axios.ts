import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AuthResponse, RefreshTokenRequest } from '../types/auth';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com/api' 
    : 'http://localhost:5197/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');

      if (!refreshToken || !accessToken) {
        // No tokens available, logout user
        logoutUser();
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post<AuthResponse>(
          `${api.defaults.baseURL}/auth/refresh`,
          {
            accessToken,
            refreshToken,
          } as RefreshTokenRequest
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Update tokens in localStorage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        logoutUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Function to logout user
const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRoles');
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Function to set tokens after successful login
export const setAuthTokens = (authResponse: AuthResponse) => {
  localStorage.setItem('accessToken', authResponse.accessToken);
  localStorage.setItem('refreshToken', authResponse.refreshToken);
  localStorage.setItem('userId', authResponse.userId);
  localStorage.setItem('userName', authResponse.userName);
  localStorage.setItem('userEmail', authResponse.userEmail);
  localStorage.setItem('userRoles', JSON.stringify(authResponse.roles));
};

// Function to get current user info
export const getCurrentUser = () => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const userRoles = localStorage.getItem('userRoles');

  if (!userId || !userName || !userEmail) {
    return null;
  }

  return {
    userId,
    userName,
    userEmail,
    roles: userRoles ? JSON.parse(userRoles) : [],
  };
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// Function to check if user has specific role
export const hasRole = (role: string): boolean => {
  const userRoles = localStorage.getItem('userRoles');
  if (!userRoles) return false;
  
  const roles = JSON.parse(userRoles);
  return roles.includes(role);
};

// Function to revoke current token
export const revokeToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    await api.post('/auth/revoke', { refreshToken });
    logoutUser();
    return true;
  } catch (error) {
    console.error('Error revoking token:', error);
    logoutUser();
    return false;
  }
};

export default api; 