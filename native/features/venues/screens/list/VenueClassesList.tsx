import React, {useEffect, useRef, useState, Suspense, lazy} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {useTheme} from '@/design-system';
import {useNavigation, useRoute} from '@react-navigation/native';
import {addDays} from 'date-fns';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDiscoverVenueClasses} from './hooks/useDiscoverVenueClasses';
import {Header, SkeletonCard} from './components';

const ClassContent = lazy(() =>
  import('./components/ClassContent').then(m => ({default: m.ClassContent})),
);

const DateSelector = lazy(() =>
  import('@/components/DateSelector').then(m => ({
    default: m.DateSelector,
  })),
);

interface VenueClassesPageParams {
  id: string;
}

export default function VenueClassesPage() {
  const router = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {id} = route.params as VenueClassesPageParams;
  const venueId = typeof id === 'string' ? id : '';
  const {colors} = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<Date[]>([]);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 10,
      velocity: 6,
    }).start();
  }, []);

  const closeScreen = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      router.goBack();
    });
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  useEffect(() => {
    const generateDateRange = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i <= 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }

      setDateRange(dates);
    };

    generateDateRange();
  }, []);

  const {data, isLoading, error} = useDiscoverVenueClasses(venueId, {
    from_date: selectedDate.toISOString(),
    to_date: addDays(selectedDate, 1).toISOString(),
  });

  const freeClasses = data?.response?.freeClasses || [];
  const scheduledClasses = data?.response?.scheduledClasses || [];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
            transform: [{translateY}],
          },
        ]}>
        <Header onClose={closeScreen} />

        <Suspense
          fallback={
            <View
              style={[
                styles.dateSkeletonContainer,
                {backgroundColor: colors.border},
              ]}
            />
          }>
          <DateSelector
            dates={dateRange}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </Suspense>

        <Suspense
          fallback={
            <View style={styles.classSkeletonContainer}>
              {Array.from({length: 3}).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </View>
          }>
          <ClassContent
            isLoading={isLoading}
            error={error instanceof Error ? error : null}
            freeClasses={freeClasses}
            scheduledClasses={scheduledClasses}
          />
        </Suspense>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  dateSkeletonContainer: {
    height: 48,
    marginBottom: 16,
  },
  classSkeletonContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
