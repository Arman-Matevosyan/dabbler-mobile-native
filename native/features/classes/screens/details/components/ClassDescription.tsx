import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/design-system';

interface ClassDescriptionProps {
  description?: string;
}

export const ClassDescription = React.memo(({ description }: ClassDescriptionProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.descriptionContainer}>
      <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
        {description || 'No description available for this class.'}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 