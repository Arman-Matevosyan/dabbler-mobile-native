import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import {useTheme} from '@design-system';

export type TextVariant =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'body'
  | 'bodySmall'
  | 'caption';

// New preset types to align with common usage throughout the app
export type TextPreset = 
  | 'headingLarge' 
  | 'headingMedium' 
  | 'headingSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export type TextColor = 'primary' | 'secondary' | 'accent' | 'custom';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  preset?: TextPreset;
  color?: TextColor;
  center?: boolean;
  bold?: boolean;
  semiBold?: boolean;
}

// Mapping from preset to styles
const presetToStyles: Record<TextPreset, any> = {
  headingLarge: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  headingMedium: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  headingSmall: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  titleLarge: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
  },
  labelLarge: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  labelMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
};

export const Text = ({
  variant = 'body',
  preset,
  color = 'primary',
  center = false,
  bold = false,
  semiBold = false,
  style,
  children,
  ...rest
}: TextProps) => {
  const {colors} = useTheme();

  const getColorByType = (): string => {
    switch (color) {
      case 'primary':
        return colors.textPrimary;
      case 'secondary':
        return colors.textSecondary;
      case 'accent':
        return colors.accent;
      default:
        return colors.textPrimary;
    }
  };

  return (
    <RNText
      style={[
        preset ? presetToStyles[preset] : styles[variant],
        {color: getColorByType()},
        center && styles.center,
        bold && styles.bold,
        semiBold && styles.semiBold,
        style,
      ]}
      {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  heading1: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  heading3: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.35,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  semiBold: {
    fontWeight: '600',
  },
});
