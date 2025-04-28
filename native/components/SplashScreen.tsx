import React, {useRef, useEffect} from 'react';
import {
  Animated, 
  StyleSheet, 
  useColorScheme, 
  View, 
  Dimensions,
  Easing
} from 'react-native';
import {useTheme} from '@design-system';

interface SplashScreenProps {
  onReady: () => void;
  startAnimation: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onReady,
  startAnimation,
}) => {
  const systemPreference = useColorScheme();
  const {mode, colors} = useTheme();
  const {width, height} = Dimensions.get('window');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  
  // Create derived animations
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isDarkMode =
    mode === 'dark' ||
    ((mode as string) === 'system' && systemPreference === 'dark');

  const logo = isDarkMode
    ? require('../assets/logo/logo_light.png')
    : require('../assets/logo/logo.png');

  const backgroundColor = isDarkMode ? colors.background : colors.background;
  const accentColor = colors.accent || '#3366FF';

  useEffect(() => {
    if (startAnimation) {
      // Create a pulsing effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ).start();

      // Main animation sequence
      Animated.sequence([
        // Initial rotation and fade-in
        Animated.parallel([
          // Rotate logo
          Animated.timing(rotation, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          // Fade in logo
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          // Scale logo up
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        
        // Bounce effect
        Animated.spring(logoTranslateY, {
          toValue: -30,
          friction: 3,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(logoTranslateY, {
          toValue: 0,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        
        // Hold for a moment
        Animated.delay(500),
        
        // Final fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onReady();
      });
    }
  }, [fadeAnim, logoOpacity, logoScale, logoTranslateY, pulse, rotation, onReady, startAnimation]);

  // Outer glow style for the logo
  const glowStyle = {
    shadowColor: accentColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  };

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          opacity: fadeAnim,
        },
      ]}>
      {/* Logo container with shadow */}
      <View style={[glowStyle, { borderRadius: width * 0.3 }]}>
        <Animated.Image
          source={logo}
          style={{
            width: width * 0.4,
            height: width * 0.4,
            opacity: logoOpacity,
            transform: [
              { scale: Animated.multiply(logoScale, pulse) },
              { translateY: logoTranslateY },
              { rotate: spin }
            ],
          }}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

export default SplashScreen;
