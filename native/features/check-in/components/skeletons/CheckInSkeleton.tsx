import { Skeleton, useTheme } from '@/design-system';
import { StyleSheet, View } from 'react-native';

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
const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
    alignItems: 'center',
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

export const CheckInScreenSkeleton = () => {
  return (
    <>
      <HeaderSkeleton />
      <QrScannerSkeleton />
    </>
  );
};
