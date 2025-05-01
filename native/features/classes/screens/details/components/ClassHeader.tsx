import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { EdgeInsets } from 'react-native-safe-area-context';

interface ClassHeaderProps {
  title: string;
  onClose: () => void;
  headerOpacity: Animated.AnimatedInterpolation<number>;
  insets?: EdgeInsets;
}

export const ClassHeader = React.memo(
  ({ title, onClose, headerOpacity, insets }: ClassHeaderProps) => {
    const { colors } = useTheme();

    const headerHeight = (insets?.top || 0) + 60;
    const paddingTop = insets?.top || 0;

    return (
      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: colors.background,
            opacity: headerOpacity,
            borderBottomColor: colors.border,
            height: headerHeight,
            paddingTop: paddingTop,
          },
        ]}>
        <TouchableOpacity style={styles.fixedHeaderButton} onPress={onClose} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.fixedHeaderTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.fixedHeaderPlaceholder} />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  fixedHeaderButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  fixedHeaderPlaceholder: {
    width: 40,
  },
});
