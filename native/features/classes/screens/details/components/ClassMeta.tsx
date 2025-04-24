import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ClassMetaProps {
  categories?: string[];
  venueName?: string;
  instructorInfo?: string;
  onVenuePress?: () => void;
}

export const ClassMeta = React.memo(({ 
  categories, 
  venueName, 
  instructorInfo, 
  onVenuePress 
}: ClassMetaProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      {categories && categories.length > 0 && (
        <View style={styles.metaRow}>
          <MaterialIcons
            name="local-offer"
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {categories.join(', ')}
          </Text>
        </View>
      )}

      {venueName && (
        <TouchableOpacity
          style={styles.metaRow}
          onPress={onVenuePress}
          disabled={!onVenuePress}
          activeOpacity={onVenuePress ? 0.7 : 1}>
          <MaterialIcons
            name="place"
            size={20}
            color={colors.accent}
            style={styles.icon}
          />
          <Text
            style={[
              styles.metaText,
              { color: colors.accent },
              styles.venueName,
            ]}>
            {venueName}
          </Text>
        </TouchableOpacity>
      )}

      {instructorInfo && (
        <View style={styles.metaRow}>
          <MaterialIcons
            name="person"
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {instructorInfo}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 24,
    marginRight: 8,
  },
  metaText: {
    fontSize: 15,
    fontWeight: '500',
  },
  venueName: {
    fontWeight: '600',
  },
}); 