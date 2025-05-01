import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface HeaderProps {
  onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClose }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {'classes.availableClasses'}
        </Text>
      </View>

      <View style={styles.shareButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
