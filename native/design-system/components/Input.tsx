import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { useTheme } from '@design-system';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: string;
  iconRight?: string;
  onIconRightPress?: () => void;
}

export const Input = ({
  label,
  error,
  iconLeft,
  iconRight,
  onIconRightPress,
  secureTextEntry,
  ...rest
}: InputProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.accent : colors.border,
            backgroundColor: colors.background,
          },
        ]}>
        {iconLeft && (
          <Icon name={iconLeft} size={20} color={colors.textSecondary} style={styles.iconLeft} />
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.textPrimary },
            iconLeft && styles.inputWithIconLeft,
            iconRight && styles.inputWithIconRight,
          ]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        {iconRight && (
          <TouchableOpacity onPress={onIconRightPress} style={styles.iconRightContainer}>
            <Icon name={iconRight} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.error, { color: colors.accent }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithIconLeft: {
    paddingLeft: 8,
  },
  inputWithIconRight: {
    paddingRight: 8,
  },
  iconLeft: {
    marginLeft: 16,
  },
  iconRightContainer: {
    padding: 10,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});
