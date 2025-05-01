import { Text, useTheme } from '@/design-system';
import { useAuthStore } from '@/stores/authStore';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

interface SocialLoginButtonsProps {
  containerStyle?: object;
  showApple?: boolean;
  buttonSize?: 'small' | 'medium' | 'large';
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  containerStyle,
  showApple = Platform.OS === 'ios',
  buttonSize = 'medium',
}) => {
  const { mode } = useTheme();
  const { socialLogin, isLoading } = useAuthStore();
  const [activeProvider, setActiveProvider] = useState<'google' | 'facebook' | 'apple' | null>(
    null,
  );
  const navigation = useNavigation();

  const [facebookScale] = useState(new Animated.Value(1));
  const [googleScale] = useState(new Animated.Value(1));

  const animateButton = (animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      switch (provider) {
        case 'facebook':
          animateButton(facebookScale);
          break;
        case 'google':
          animateButton(googleScale);
          break;
      }
      setActiveProvider(provider);
      await socialLogin(provider);
      setActiveProvider(null);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  {
                    name: 'Profile',
                    state: {
                      routes: [{ name: 'AuthUser' }],
                    },
                  },
                ],
              },
            },
          ],
        }),
      );
    } catch (e) {
      setActiveProvider(null);
      return null;
    }
  };

  const getSizes = () => {
    switch (buttonSize) {
      case 'small':
        return {
          buttonSize: 40,
          iconSize: 16,
          borderRadius: 4,
          containerGap: 12,
        };
      case 'large':
        return {
          buttonSize: 50,
          iconSize: 20,
          borderRadius: 5,
          containerGap: 16,
        };
      case 'medium':
      default:
        return {
          buttonSize: 44,
          iconSize: 18,
          borderRadius: 4,
          containerGap: 14,
        };
    }
  };

  const { buttonSize: btnSize, iconSize, borderRadius, containerGap } = getSizes();

  const isDark = mode === 'dark';

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: containerGap,
      marginVertical: 12,
    },
    socialButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: btnSize,
      height: btnSize,
      borderRadius: borderRadius,
      borderWidth: 1,
    },
    facebookButton: {
      borderColor: '#1877F2',
      backgroundColor: 'transparent',
    },
    googleButton: {
      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
      backgroundColor: 'transparent',
    },
    appleButton: {
      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
      backgroundColor: 'transparent',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius,
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={{ transform: [{ scale: facebookScale }] }}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.socialButton, styles.facebookButton]}
          onPress={() => handleSocialAuth('facebook')}
          disabled={isLoading}>
          <FontAwesome name="facebook" size={iconSize} color="#1877F2" />
          {isLoading && activeProvider === 'facebook' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#1877F2" size="small" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: googleScale }] }}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => handleSocialAuth('google')}
          disabled={isLoading}>
          <FontAwesome name="google" size={iconSize} color="#DB4437" />
          {isLoading && activeProvider === 'google' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#DB4437" size="small" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
