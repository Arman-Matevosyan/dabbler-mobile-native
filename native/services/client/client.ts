import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import {Platform} from 'react-native';
import {Storage} from '../storage';
import {MMKVLoader} from 'react-native-mmkv-storage';
import {LANGUAGE_KEY} from '../i18n';

const DEV_API_URL = 'https://dev-api.dabblerclub.com/';
const PROD_API_URL = 'https://api.dabblerclub.com/';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

const mmkvStorage = new MMKVLoader().withEncryption().initialize();

export const baseClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Platform': Platform.OS,
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

baseClient.interceptors.request.use(config => {
  const token = Storage.getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const language = mmkvStorage.getString(LANGUAGE_KEY) || 'en';
  config.headers['X-Lang'] = language;

  return config;
});

baseClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (error?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((newToken: string) => {
            originalRequest.headers!.Authorization = `Bearer ${newToken}`;
            resolve(baseClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Storage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await baseClient.get('/auth/refresh', {
          headers: {Authorization: `Bearer ${refreshToken}`},
        });

        const {accessToken, refreshToken: newRefreshToken} = response.data;
        Storage.storeTokens(accessToken, newRefreshToken);

        refreshSubscribers.forEach(cb => cb(accessToken));
        refreshSubscribers = [];

        return baseClient(originalRequest);
      } catch (refreshError) {
        Storage.clearTokens();
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

interface ApiOptions extends AxiosRequestConfig {
  withAuth?: boolean;
}

export const client = {
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    options: ApiOptions = {},
  ): Promise<T> {
    const {withAuth = false, ...config} = options;
    if (withAuth && !Storage.getAccessToken()) {
      throw new Error('Authentication required');
    }

    try {
      const response = await baseClient.request<T>({
        method,
        url,
        ...(method === 'GET' || method === 'DELETE' ? {params: data} : {data}),
        ...config,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        type ErrorResponseData = {message?: string};
        const errorResponseData =
          (axiosError.response?.data as ErrorResponseData) || {};
        const errorMessage = errorResponseData?.message || axiosError.message;
        throw new Error(errorMessage || 'An error occurred');
      }
      throw error;
    }
  },

  get<T>(url: string, params?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('GET', url, params, options);
  },

  post<T>(url: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('POST', url, data, options);
  },

  put<T>(url: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  },

  delete<T>(url: string, params?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('DELETE', url, params, options);
  },

  patch<T>(url: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  },
};
