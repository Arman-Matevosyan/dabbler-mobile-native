import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, Text} from '@design-system';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ClassListEmptyStateProps {
  type: 'free' | 'scheduled';
}

const ClassListEmptyState = ({type}: ClassListEmptyStateProps) => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="event-busy"
        size={64}
        color={colors.textSecondary}
        style={styles.icon}
      />
      <Text style={[styles.title, {color: colors.textPrimary}]}>
        {type === 'free'
          ? t('checkin.noFreeClasses')
          : t('checkin.noScheduledClasses')}
      </Text>
      <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
        {type === 'free'
          ? t('checkin.checkLater')
          : t('checkin.enrollFirst')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ClassListEmptyState;
