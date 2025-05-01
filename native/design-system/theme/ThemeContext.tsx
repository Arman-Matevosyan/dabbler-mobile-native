import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { MMKVLoader } from 'react-native-mmkv-storage';
import { colors } from './colors';

let storage: any;
try {
  storage = new MMKVLoader().initialize();
} catch (error) {
  console.error('Failed to initialize MMKV storage:', error);
  storage = {
    getString: () => null,
    setString: () => {},
  };
}

const THEME_MODE_KEY = 'theme_mode';

export type ThemeMode = 'light' | 'dark';
export type ThemeColors = typeof colors.light;

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  mapColors: typeof colors.map;
  setMode: (mode: ThemeMode) => void;
  systemTheme: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = (useColorScheme() as ThemeMode) || 'light';

  const getSavedThemeMode = (): ThemeMode => {
    try {
      const savedMode = storage.getString(THEME_MODE_KEY);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
        return savedMode as ThemeMode;
      }
    } catch (error) {
      console.error('Error reading theme from storage:', error);
    }
    return systemColorScheme;
  };

  const [mode, setModeState] = useState<ThemeMode>(getSavedThemeMode());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      try {
        const savedMode = storage.getString(THEME_MODE_KEY);
        if (!savedMode) {
          setModeState((colorScheme as ThemeMode) || 'light');
        }
      } catch (error) {
        console.error('Error handling appearance change:', error);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      try {
        if (newMode !== 'light' && newMode !== 'dark') {
          console.warn(`Invalid theme mode: ${newMode}, using system default`);
          setModeState(systemColorScheme);
          return;
        }

        setModeState(newMode);

        try {
          storage.setString(THEME_MODE_KEY, newMode);
        } catch (storageError) {
          console.error('Failed to save theme preference:', storageError);
        }
      } catch (error) {
        console.error('Error setting theme:', error);
        setModeState(systemColorScheme);
      }
    },
    [systemColorScheme],
  );

  const themeColors = mode === 'dark' ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors: themeColors,
        mapColors: colors.map,
        setMode,
        systemTheme: systemColorScheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
