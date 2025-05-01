import { MMKVLoader } from 'react-native-mmkv-storage';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const storage = new MMKVLoader().withEncryption().initialize();

export const Storage = {
  getAccessToken: () => storage.getString(ACCESS_TOKEN_KEY),
  getRefreshToken: () => storage.getString(REFRESH_TOKEN_KEY),
  storeTokens: (accessToken: string, refreshToken: string) => {
    storage.setString(ACCESS_TOKEN_KEY, accessToken);
    storage.setString(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearTokens: () => {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
  },
  storeRefreshToken: (refreshToken: string) => storage.setString(REFRESH_TOKEN_KEY, refreshToken),
};
