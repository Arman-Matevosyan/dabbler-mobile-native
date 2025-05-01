import { create } from 'zustand';
import { Storage } from '../services/storage';
import { queryClient } from '@/config/queryClient';
import { authService, PaymentAPI, UserAPI } from '@/services/api';
import { PaymentQueryKeys, UserQueryKeys } from '@/constants/queryKeys';
import { useNavigation } from '@react-navigation/native';
import { ImagePickerResponse } from 'react-native-image-picker';
import { Linking } from 'react-native';
import { baseClient, client } from '@/services/client';

type AuthStore = {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasActiveSubscription: boolean;
  showSubscriptionModal: boolean;

  initialize: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkSubscription: () => Promise<void>;
  handleSocialAuthCallback: (token: string) => Promise<void>;
  setShowSubscriptionModal: (show: boolean) => void;
  uploadAvatar: (file: FormData) => Promise<void>;
  isUploading: boolean;
  isInitializing: boolean;
  isInitilized: boolean;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: !!Storage.getAccessToken(),
  isLoading: true,
  error: null,
  hasActiveSubscription: false,
  showSubscriptionModal: false,
  isUploading: false,
  uploadError: null,
  isInitializing: false,
  isInitilized: false,

  initialize: async () => {
    if (get().isInitilized) return;
    if (get().isInitializing) return;

    set({ isInitializing: true });
    try {
      if (!Storage.getAccessToken()) throw new Error('No token');
      const user = await UserAPI.getCurrentUser();
      await get().checkSubscription();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
    } finally {
      set({ isInitializing: false, isInitilized: true });
    }
  },

  login: async credentials => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(credentials);
      Storage.storeTokens(response.accessToken, response.refreshToken);
      set({ isAuthenticated: true, isLoading: false });
      await get().checkSubscription();

      if (!get().hasActiveSubscription) {
        set({ showSubscriptionModal: true });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  socialLogin: async (provider: 'google' | 'facebook') => {
    try {
      set({ isLoading: true, error: null });
      const url = provider === 'google' ? authService.googleLogin() : authService.facebookLogin();

      Linking.openURL(url);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Social login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  handleSocialAuthCallback: async (refreshToken: string) => {
    try {
      set({ isLoading: true, error: null });
      Storage.storeRefreshToken(refreshToken);
      const response = await baseClient.get('/auth/refresh', {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      Storage.storeTokens(response.data.accessToken, response.data.refreshToken);

      await get().checkSubscription();
      if (!get().hasActiveSubscription) {
        set({ showSubscriptionModal: true });
      }
      set({
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Social login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      Storage.clearTokens();
      throw error;
    } finally {
      await queryClient.invalidateQueries({ queryKey: [UserQueryKeys.userData] });
    }
  },

  forgotPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await authService.forgotPassword({ email });
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Password reset failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async credentials => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.signup(credentials);

      Storage.storeTokens(response.accessToken, response.refreshToken);
      set({ isAuthenticated: true, isLoading: false });
      await get().checkSubscription();

      if (!get().hasActiveSubscription) {
        set({ showSubscriptionModal: true });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      Storage.clearTokens();
      queryClient.removeQueries();
      set({
        user: null,
        isAuthenticated: false,
        showSubscriptionModal: false,
        hasActiveSubscription: false,
      });
    }
  },

  checkSubscription: async () => {
    try {
      const subscription = await queryClient.fetchQuery({
        queryKey: [PaymentQueryKeys.subscriptions],
        queryFn: () => PaymentAPI.getSubscriptions(),
        staleTime: 5 * 60 * 1000,
      });

      set({
        hasActiveSubscription: !!subscription?.plan?.planId,
      });
    } catch (error) {
      set({ hasActiveSubscription: false });
    }
  },
  uploadAvatar: async formData => {
    try {
      set({ isUploading: true });
      await UserAPI.uploadAvatar(formData);
      await queryClient.invalidateQueries({ queryKey: [UserQueryKeys.userData] });

      set({
        isUploading: false,
      });
    } catch (error) {
      set({
        isUploading: false,
      });
      throw error;
    }
  },
  setShowSubscriptionModal: show => set({ showSubscriptionModal: show }),
  clearError: () => set({ error: null }),
}));
