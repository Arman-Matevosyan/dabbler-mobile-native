import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  isOffline?: boolean;
  isNetworkError?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  message = 'No items match your search criteria.',
  icon = 'info',
  isOffline = false,
  isNetworkError = false,
}) => {
  const { colors } = useTheme();

  let displayTitle = title;
  let displayMessage = message;
  let displayIcon = icon;

  if (isOffline) {
    displayTitle = 'classes.youAreOffline';
    displayMessage = 'classes.connectToInternet';
    displayIcon = 'wifi-off';
  } else if (isNetworkError) {
    displayTitle = 'classes.connectionIssue';
    displayMessage = 'classes.couldntConnectToServers';
    displayIcon = 'cloud-off';
  }

  return (
    <View style={styles.container}>
      <MaterialIcons name={displayIcon} size={60} color={colors.textSecondary} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>{displayTitle}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{displayMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
