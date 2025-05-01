import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableProps,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  title,
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  contentContainerStyle,
  ...rest
}) => {
  const { colors } = useTheme();

  const buttonStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: colors.accent,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: colors.textSecondary,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.accent,
    },
    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  const textStyles: Record<ButtonVariant, TextStyle> = {
    primary: {
      color: '#FFFFFF',
    },
    secondary: {
      color: '#FFFFFF',
    },
    outline: {
      color: colors.accent,
    },
    text: {
      color: colors.accent,
    },
    ghost: {
      color: colors.textPrimary,
    },
  };

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    small: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
    },
    medium: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    large: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
  };

  const textSizeStyles: Record<ButtonSize, TextStyle> = {
    small: {
      fontSize: 12,
    },
    medium: {
      fontSize: 14,
    },
    large: {
      fontSize: 16,
    },
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        buttonStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      disabled={disabled || loading}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      {...rest}>
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {loading ? (
          <ActivityIndicator size="small" color={textStyles[variant].color} />
        ) : (
          title && (
            <Text style={[styles.text, textStyles[variant], textSizeStyles[size], textStyle]}>
              {title}
            </Text>
          )
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
