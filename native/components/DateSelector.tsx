import { useTheme } from '@/design-system';
import { format } from 'date-fns';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDate,
  onDateSelect,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return {
        display: t('classes.today'),
        isToday,
      };
    }

    return {
      display: `${format(date, 'EEE')} ${format(date, 'd')}`,
      isToday,
    };
  };

  return (
    <View style={[styles.dateSelectionContainer, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContent}>
        {dates.map((date, index) => {
          const formatted = formatDate(date);
          const isSelected = date.toDateString() === selectedDate.toDateString();

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={[
                styles.dateItem,
                formatted.isToday && {
                  borderRightColor: colors.border,
                  borderRightWidth: 1,
                  height: '90%',
                  alignSelf: 'center',
                },
              ]}
              onPress={() => onDateSelect(date)}>
              <Text
                style={[
                  styles.dateText,
                  {
                    color: isSelected ? colors.accent : colors.textSecondary,
                    fontWeight: isSelected || formatted.isToday ? '600' : '500',
                  },
                ]}>
                {formatted.display}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dateSelectionContainer: {
    borderBottomWidth: 1,
    height: 48,
  },
  dateScrollContent: {
    paddingHorizontal: 16,
    height: '100%',
  },
  dateItem: {
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    minWidth: 80,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
