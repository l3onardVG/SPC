import api, { setAuthTokens, getCurrentUser, isAuthenticated, hasRole, revokeToken } from '../utils/axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export class AuthService {
  // Login with email and password
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const authData = response.data;
      
      // Store tokens and user info
      setAuthTokens(authData);
      
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<boolean> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.status === 200;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<boolean> {
    try {
      const success = await revokeToken();
      return success;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if revoke fails, we should still logout locally
      return true;
    }
  }

  // Get current user info
  static getCurrentUser() {
    return getCurrentUser();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return isAuthenticated();
  }

  // Check if user has specific role
  static hasRole(role: string): boolean {
    return hasRole(role);
  }

  // Check if user is admin
  static isAdmin(): boolean {
    return hasRole('Admin');
  }

  // Refresh token manually (if needed)
  static async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');

      if (!refreshToken || !accessToken) {
        throw new Error('No tokens available');
      }

      const response = await api.post<AuthResponse>('/auth/refresh', {
        accessToken,
        refreshToken,
      });

      const authData = response.data;
      setAuthTokens(authData);
      
      return authData;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Get stored tokens
  static getTokens() {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }

  // Clear all auth data
  static clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userSurname');
    localStorage.removeItem('userRoles');
  }
}

export default AuthService; 