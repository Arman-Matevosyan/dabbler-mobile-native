import { useColorScheme, Platform } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { colors } from '@/design-system/theme/colors';

export const hideSplashScreen = async () => {
  try {
    // Only hide from the navigation container if the platform is Android
    // iOS will be handled by the AnimatedSplash component
    if (Platform.OS === 'android') {
      await RNBootSplash.hide({ fade: true });
    }
  } catch (error) {
    console.error('Error hiding splash screen:', error);
  }
};

export const getThemeBasedSplashColors = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return {
    backgroundColor: isDarkMode ? colors.dark.background : colors.light.background,
    primaryColor: isDarkMode ? colors.dark.accent : colors.light.accent,
  };
}; 