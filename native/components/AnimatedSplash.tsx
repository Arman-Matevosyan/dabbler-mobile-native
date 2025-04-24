import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Platform,
} from 'react-native';
import {colors} from '@/design-system/theme/colors';
import RNBootSplash from 'react-native-bootsplash';

const {width, height} = Dimensions.get('window');

interface AnimatedSplashProps {
  children: React.ReactNode;
  logoScale?: number;
  logoOpacity?: number;
  logoTranslateY?: number;
  logoRotate?: number;
  backgroundOpacity?: number;
  animationDuration?: number;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({
  children,
  logoScale = 1.2,
  logoOpacity = 0.8,
  logoTranslateY = -20,
  logoRotate = 10,
  backgroundOpacity = 0.7,
  animationDuration = 800,
}) => {
  const [splashVisible, setSplashVisible] = useState(true);
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;
  const logoTranslateYAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode
    ? colors.dark.background
    : colors.light.background;

  useEffect(() => {
    const init = async () => {
      try {
        // For iOS, we need to explicitly hide the native splash
        if (Platform.OS === 'ios') {
          await RNBootSplash.hide({fade: true});
        }
        
        const isVisible = await RNBootSplash.isVisible();
        return isVisible;
      } catch (error) {
        console.error('Splash visibility error:', error);
        return true; // Default to showing our custom splash animation
      }
    };

    init().then(visible => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoScaleAnim, {
            toValue: logoScale,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(logoAnim, {
            toValue: logoOpacity,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslateYAnim, {
            toValue: logoTranslateY,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(logoRotateAnim, {
            toValue: logoRotate,
            duration: animationDuration,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: animationDuration / 2,
          useNativeDriver: true,
          delay: 100,
        }),
      ]).start(({finished}) => {
        if (finished) {
          setSplashVisible(false);
        }
      });
    });
  }, []);

  const logoRotateInterpolate = logoRotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{flex: 1}}>
      {children}
      {splashVisible && (
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor,
              opacity: containerOpacity,
            },
          ]}
          pointerEvents="none">
          <Animated.Image
            source={
              isDarkMode
                ? require('../assets/bootsplash_logo_dark.png')
                : require('../assets/bootsplash_logo_light.png')
            }
            style={[
              styles.logo,
              {
                opacity: logoAnim,
                transform: [
                  {scale: logoScaleAnim},
                  {translateY: logoTranslateYAnim},
                  {rotate: logoRotateInterpolate},
                ],
              },
            ]}
            fadeDuration={0}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default AnimatedSplash;
