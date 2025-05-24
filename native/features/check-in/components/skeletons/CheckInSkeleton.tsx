import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Skeleton, useTheme } from '@/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export const HeaderSkeleton = () => {
  return (
    <View style={styles.header}>
      <Skeleton width="60%" height={28} style={{ marginBottom: 8, alignSelf: 'center' }} />
      <Skeleton width="80%" height={16} style={{ alignSelf: 'center' }} />
    </View>
  );
};

export const QrScannerSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.scannerSkeleton, { backgroundColor: colors.card }]}>
      <Skeleton width={200} height={200} style={{ borderRadius: 8 }} />
      <Skeleton width="70%" height={50} style={{ borderRadius: 8, marginTop: 24 }} />
    </View>
  );
};

export const QrImageSkeleton = () => {
  return (
    <View style={styles.qrContainer}>
      <Skeleton width={width - 50} height={height / 3} />
    </View>
  );
};

export const ScanButtonSkeleton = () => {
  return (
    <View style={styles.buttonContainer}>
      <Skeleton width="80%" height={48} style={{ borderRadius: 8 }} />
    </View>
  );
};

export const CheckInScreenSkeleton = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <View style={[styles.content, { paddingBottom: insets.bottom + 60 }]}>
        <QrImageSkeleton />
        <HeaderSkeleton />
        <ScanButtonSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  qrContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  scannerSkeleton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
});

export default CheckInScreenSkeleton;
