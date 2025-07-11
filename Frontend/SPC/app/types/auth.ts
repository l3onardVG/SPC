export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  userId: string;
  userName: string;
  userEmail: string;
  name: string;
  surname: string;
  roles: string[];
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RevokeTokenRequest {
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  documentType: string;
  documentNumber: string;
  userType: string;
  termsAceptance: boolean;
} 