import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@/design-system';

interface VenueImportantInfoProps {
  importantInfo?: string;
  showImportantInfo: boolean;
  toggleImportantInfo: () => void;
}

export const VenueImportantInfo: React.FC<VenueImportantInfoProps> = ({
  importantInfo,
  showImportantInfo,
  toggleImportantInfo,
}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
        {'venues.importantInfo'}
      </Text>
      <Text
        style={[styles.sectionText, {color: colors.textSecondary}]}
        numberOfLines={showImportantInfo ? undefined : 3}>
        {importantInfo || 'common.noResults'}
      </Text>
      {importantInfo && (
        <TouchableOpacity onPress={toggleImportantInfo}>
          <Text style={[styles.readMore, {color: colors.accent}]}>
            {showImportantInfo ? 'venues.showLess' : 'venues.showMore'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
}); 