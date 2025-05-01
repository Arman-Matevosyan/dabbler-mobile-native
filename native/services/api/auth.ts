import { API_URL, client } from '../client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface SocialAuthResult {
  authUrl: string;
  callbackUrl: string;
}

export interface SocialLoginResult {
  accessToken?: string;
  refreshToken?: string;
}

export interface SocialAuthDeepLinkResult {
  refreshToken: string;
  loginType?: 'google' | 'facebook';
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      return await client.post<AuthResponse>('/auth/signin', credentials);
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async () => {
    return await client.post<AuthResponse>('/users/me/verify-email');
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      return await client.post<AuthResponse>('/auth/signup', credentials);
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    try {
      await client.post('/auth/forgot-password', data);
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await client.post('/auth/logout', {}, { withAuth: true });
    } catch (error) {
      console.log('Logout error:', error);
    }
  },

  googleLogin: (): string => {
    return `${API_URL}auth/google`;
  },

  facebookLogin: (): string => {
    return `${API_URL}auth/fb`;
  },
};
