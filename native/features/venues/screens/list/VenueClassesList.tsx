import React, { useEffect, useRef, useState, Suspense, lazy, useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '@/design-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addDays, format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDiscoverVenueClasses } from './hooks/useDiscoverVenueClasses';
import { Header } from './components';
import {
  HeaderSkeleton,
  DateSelectorSkeleton,
  ClassCardSkeleton,
  VenueClassesListSkeleton,
} from './components/skeletons/VenueClassesSkeleton';
import { useQueryClient } from '@tanstack/react-query';
import { ClassQueryKeys } from '@/constants/queryKeys';
import { useTranslation } from 'react-i18next';

const ClassContent = lazy(() =>
  import('./components/ClassContent').then(m => ({ default: m.ClassContent })),
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
  const { id } = route.params as VenueClassesPageParams;
  const venueId = typeof id === 'string' ? id : '';
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [dateFirstLoad, setDateFirstLoad] = useState<Record<string, boolean>>({});

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
      const dateLoadingMap: Record<string, boolean> = {};

      for (let i = 0; i <= 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);

        dateLoadingMap[format(date, 'yyyy-MM-dd')] = false;
      }

      setDateRange(dates);
      setDateFirstLoad(dateLoadingMap);
    };

    generateDateRange();
  }, []);

  useEffect(() => {
    const nextDay = addDays(selectedDate, 1);
    if (
      nextDay &&
      dateRange.some(date => format(date, 'yyyy-MM-dd') === format(nextDay, 'yyyy-MM-dd'))
    ) {
      const params = {
        from_date: nextDay.toISOString(),
        to_date: addDays(nextDay, 1).toISOString(),
      };

      queryClient.prefetchQuery({
        queryKey: [ClassQueryKeys.discoverVenue, venueId, params],
        queryFn: () =>
          import('./hooks/useDiscoverVenueClasses').then(module =>
            module.useDiscoverVenueClasses(venueId, params),
          ),
      });
    }
  }, [selectedDate, dateRange, venueId, queryClient]);

  const params = useMemo(
    () => ({
      from_date: selectedDate.toISOString(),
      to_date: addDays(selectedDate, 1).toISOString(),
    }),
    [selectedDate],
  );

  const { data, isLoading, error } = useDiscoverVenueClasses(venueId, params);

  const isFirstLoadForDate = !dateFirstLoad[format(selectedDate, 'yyyy-MM-dd')];

  useEffect(() => {
    if (!isLoading && isFirstLoadForDate) {
      setDateFirstLoad(prev => ({
        ...prev,
        [format(selectedDate, 'yyyy-MM-dd')]: true,
      }));
    }
  }, [isLoading, isFirstLoadForDate, selectedDate]);

  const freeClasses = data?.freeClasses || [];
  const scheduledClasses = data?.scheduledClasses || [];

  if (!data && isLoading && Object.values(dateFirstLoad).every(loaded => !loaded)) {
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
        <VenueClassesListSkeleton />
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
          paddingBottom: insets.bottom,
        },
      ]}>
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
            transform: [{ translateY }],
          },
        ]}>
        <Suspense fallback={<HeaderSkeleton />}>
          <Header onClose={closeScreen} />
        </Suspense>

        <Suspense fallback={<DateSelectorSkeleton />}>
          <DateSelector
            dates={dateRange}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </Suspense>

        <Suspense
          fallback={
            <View style={styles.classSkeletonContainer}>
              <ClassCardSkeleton />
              <ClassCardSkeleton />
              <ClassCardSkeleton />
            </View>
          }>
          <ClassContent
            isLoading={isLoading && isFirstLoadForDate}
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
  classSkeletonContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
    paddingTop: 12,
  },
});
