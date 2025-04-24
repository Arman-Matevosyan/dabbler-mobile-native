import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors } from '@/design-system/theme/colors';

interface LogoProps {
  size?: number;
}

const SplashLogo: React.FC<LogoProps> = ({ size = 100 }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const themeColors = isDarkMode ? colors.dark : colors.light;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { backgroundColor: themeColors.accent }]}>
        <Text style={[styles.text, { color: '#FFFFFF' }]}>D</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default SplashLogo; 