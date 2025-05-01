import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/design-system';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VenueActionsProps {
  onClassesPress: () => void;
}

export const VenueActions: React.FC<VenueActionsProps> = ({ onClassesPress }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.scheduleButtonContainer,
        {
          backgroundColor: colors.background,
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
          paddingBottom: Platform.OS === 'ios' ? insets.bottom || 16 : 16,
        },
      ]}
    >
      <View style={styles.scheduleButtonWrapper}>
        <TouchableOpacity
          onPress={onClassesPress}
          style={[
            styles.scheduleButton,
            { backgroundColor: colors.accent },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.scheduleButtonText}>
            {t('venues.goToClasses')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    zIndex: 10,
  },
  scheduleButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  scheduleButton: {
    height: 44,
    width: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
