import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

interface BookingInfoProps {
  isClassBooked: boolean;
  cancelDateStr?: string | null;
  onAddToCalendar: () => void;
}

export const BookingInfo = React.memo(({ 
  isClassBooked, 
  cancelDateStr, 
  onAddToCalendar 
}: BookingInfoProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  if (!isClassBooked) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
          {t('classes.details.bookingInfo')}
        </Text>
      </View>

      <View
        style={[
          styles.statusContainer,
          {backgroundColor: colors.background, borderColor: colors.border},
        ]}>
        <View style={styles.statusIconContainer}>
          <MaterialIcons name="event-available" size={24} color="#4CAF50" />
          <Text style={[styles.statusText, {color: colors.textPrimary}]}>
            {t('classes.details.bookedStatus')}
          </Text>
        </View>

        {cancelDateStr && (
          <Text style={[styles.cancelText, {color: colors.textSecondary}]}>
            {t('classes.details.freeCancellation')} {cancelDateStr}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.calendarButton, {backgroundColor: colors.accent}]}
          onPress={onAddToCalendar}
          activeOpacity={0.7}>
          <MaterialIcons name="event" size={20} color="white" />
          <Text style={styles.calendarButtonText}>
            {t('classes.details.addToCalendar')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  statusIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelText: {
    fontSize: 14,
    marginBottom: 16,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  calendarButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 