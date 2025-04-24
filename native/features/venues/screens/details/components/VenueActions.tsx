import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme, Button} from '@/design-system';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface VenueActionsProps {
  onClassesPress: () => void;
}

export const VenueActions: React.FC<VenueActionsProps> = ({onClassesPress}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.actionsContainer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom || 16 : 16,
        },
      ]}>
      <View style={styles.actionsWrapper}>
        <Button
          title={'venues.goToClasses'}
          variant="primary"
          size="large"
          onPress={onClassesPress}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    zIndex: 10,
  },
  actionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    minWidth: 150,
    borderRadius: 4, // Less rounded corners
  },
});
