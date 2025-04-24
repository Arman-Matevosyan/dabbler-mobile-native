import React, {Suspense, lazy, useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme, Text, Skeleton} from '@design-system';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import QrCheck from '@/assets/svg/QrCheck';
import {CheckInStackParamList} from './CheckInNavigator';
import {IDiscoverClass} from '@/types/class.interfaces';
import {useTranslation} from 'react-i18next';

type CheckInScreenNavigationProp = StackNavigationProp<
  CheckInStackParamList,
  'CheckIn'
>;
const {width, height} = Dimensions.get('window');
const QrScanner = lazy(() =>
  import('./components/QrScanner').then(module => ({
    default: module.QrScanner,
  })),
);

const HeaderSkeleton = () => {
  return (
    <View style={styles.header}>
      <Skeleton
        width="60%"
        height={28}
        style={{marginBottom: 8, alignSelf: 'center'}}
      />
      <Skeleton width="80%" height={16} style={{alignSelf: 'center'}} />
    </View>
  );
};

const QrScannerSkeleton = () => {
  const {colors} = useTheme();
  return (
    <View style={[styles.scannerSkeleton, {backgroundColor: colors.card}]}>
      <Skeleton width={200} height={200} style={{borderRadius: 8}} />
      <Skeleton
        width="70%"
        height={50}
        style={{borderRadius: 8, marginTop: 24}}
      />
    </View>
  );
};

export default function CheckInScreen() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CheckInScreenNavigationProp>();
  const [scanning, setScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

  const handleOnScan = useCallback(async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(undefined);
        }, 1500);
      });

      const mockData: {
        freeClasses: IDiscoverClass[];
        scheduledClasses: IDiscoverClass[];
      } = {
        freeClasses: [
          {
            id: '1',
            name: 'Yoga Class',
            instructorInfo: 'John Doe',
            duration: 60,
            scheduled: false,
            date: '',
            scheduledSpots: 0,
            totalSpots: 15,
            covers: [{url: 'https://example.com/yoga.jpg'}],
            venue: {
              name: 'Downtown Studio',
              id: 'venue-1',
            },
            categories: ['Yoga', 'Wellness'],
            location: {
              type: 'Point',
              coordinates: ['-122.4194', '37.7749'],
            },
          },
        ],
        scheduledClasses: [
          {
            id: '2',
            name: 'Spin Class',
            instructorInfo: 'Jane Smith',
            duration: 45,
            scheduled: true,
            date: '2023-07-15T10:00:00Z',
            scheduledSpots: 8,
            totalSpots: 12,
            covers: [{url: 'https://example.com/spin.jpg'}],
            venue: {
              name: 'Fitness Center',
              id: 'venue-2',
            },
            categories: ['Cardio', 'Cycling'],
            location: {
              type: 'Point',
              coordinates: ['-122.4167', '37.7833'],
            },
          },
        ],
      };

      navigation.navigate('CheckInListScreen', {
        data: mockData,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during QR scan:', error);
    } finally {
      setIsLoading(false);
      setScanning(false);
    }
  }, [navigation]);

  const handleScanPress = useCallback(() => {
    setScanning(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setScanning(false);
  }, []);

  if (scanning) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Suspense fallback={<QrScannerSkeleton />}>
          <QrScanner
            onQrCodeScanned={handleOnScan}
            onClose={handleCloseScanner}
            isLoading={isLoading}
          />
        </Suspense>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <View style={[styles.content, {paddingBottom: insets.bottom + 60}]}>
        <View style={styles.qrContainer}>
          <QrCheck width={width - 50} height={height * 2} />
        </View>
        <Suspense fallback={<HeaderSkeleton />}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: colors.textPrimary}]}>
              {t('checkin.checkIn')}
            </Text>
            <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
              {t('checkin.scanToCheckIn')}
            </Text>
          </View>
        </Suspense>

        <Suspense fallback={<QrScannerSkeleton />}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.scanButton, {backgroundColor: colors.accent}]}
              onPress={handleScanPress}
              activeOpacity={0.8}>
              <MaterialIcons name="qr-code-scanner" size={24} color="white" />
              <Text style={[styles.buttonText, {color: 'white'}]}>
                {t('checkin.scanQrCode')}
              </Text>
            </TouchableOpacity>
          </View>
        </Suspense>
      </View>
    </View>
  );
}

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
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
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
