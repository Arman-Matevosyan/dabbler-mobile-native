import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {MMKVLoader} from 'react-native-mmkv-storage';

import en from './translations/en';
import ru from './translations/ru';
import hy from './translations/hy';

export const LANGUAGE_KEY = 'user_language';

const LANGUAGES = ['en', 'ru', 'hy'] as const;
const DEFAULT_LANGUAGE = 'en';

const storage = new MMKVLoader().withEncryption().initialize();

const getSavedLanguage = (): string => {
  const savedLanguage = storage.getString(LANGUAGE_KEY);

  if (savedLanguage && LANGUAGES.includes(savedLanguage as any)) {
    return savedLanguage;
  }

  const deviceLanguages = RNLocalize.getLocales().map(
    locale => locale.languageCode,
  );
  const bestMatch = deviceLanguages.find(lang =>
    LANGUAGES.includes(lang as any),
  );

  return bestMatch || DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: {translation: en},
    ru: {translation: ru},
    hy: {translation: hy},
  },
  lng: getSavedLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (language: string): void => {
  if (LANGUAGES.includes(language as any)) {
    storage.setString(LANGUAGE_KEY, language);
    i18n.changeLanguage(language);
  }
};

export const SUPPORTED_LANGUAGES = LANGUAGES;

export default i18n;
