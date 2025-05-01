import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ClassInfoProps {
  title: string;
  formattedDate?: string;
  formattedTime?: string;
}

export const ClassInfo = React.memo(({ title, formattedDate, formattedTime }: ClassInfoProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

      {formattedDate && formattedTime && (
        <View style={styles.dateTimeContainer}>
          <MaterialIcons
            name="event"
            size={22}
            color={colors.textPrimary}
            style={styles.dateTimeIcon}
          />
          <Text style={[styles.dateTimeText, { color: colors.textPrimary }]}>{formattedDate}</Text>
          <MaterialIcons
            name="schedule"
            size={22}
            color={colors.textPrimary}
            style={styles.dateTimeIcon}
          />
          <Text style={[styles.dateTimeText, { color: colors.textPrimary }]}>{formattedTime}</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateTimeIcon: {
    marginRight: 4,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 12,
  },
});
