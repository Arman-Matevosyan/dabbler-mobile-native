import React, {useCallback, useMemo, Suspense, lazy} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, Text} from '@/design-system';
import {useDateTimeFilters} from './hooks/useDateTimeFilters';
import {useClassSearchFilters} from '@/stores/searchStore';
import {ClassesListSkeleton} from './components/ClassSkeleton';
import {useClassesData} from './hooks/useClassData';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchWithCategories} from '@/components/SearchWithCategories';
import {ClassList, TimeRangeSlider} from './components';
import {DateSelector} from '@/components/DateSelector';
import {useTranslation} from 'react-i18next';

const ClassCard = lazy(async () => {
  const module = await import('@/components/ClassCard');
  return {default: module.ClassCard};
});

const generateDateRange = (days: number) => {
  const today = new Date();
  return Array.from({length: days}, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return date;
  });
};

interface ClassItem {
  id: string;
  name: string;
  covers: Array<{url: string}>;
  date?: string;
  duration: number;
  venue: {name: string};
  instructorInfo: string;
  categories: string[];
  scheduled: boolean;
  scheduledSpots: number;
  totalSpots: number;
}

export default function ClassesScreen() {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {timeRange, setTimeRange, selectedDate, setSelectedDate, classParams} =
    useDateTimeFilters();

  const {query, category, setQuery, setCategory} = useClassSearchFilters();
  const {classes, isLoading, refetch} = useClassesData(classParams);
  const dateRange = useMemo(() => generateDateRange(14), []);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    ({item}: {item: ClassItem}) => <ClassCard classItem={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: ClassItem) => `${item.id}-${item.date}`,
    [],
  );

  const ListEmptyComponent = useMemo(() => {
    if (!classes?.length && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            {t('classes.noClassesFound')}
          </Text>
        </View>
      );
    }
    return null;
  }, [classes, isLoading, colors.textSecondary, t]);

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
      <Suspense
        fallback={
          <View
            style={[styles.searchPlaceholder, {backgroundColor: colors.card}]}
          />
        }>
        <View style={styles.searchWrapper}>
          <SearchWithCategories
            searchValue={query}
            onSearchChange={setQuery}
            selectedCategories={category}
            onCategoryToggle={setCategory}
            placeholder={t('classes.searchClasses')}
            isLoading={isLoading}
          />
        </View>
      </Suspense>

      <Suspense
        fallback={
          <View
            style={[
              styles.timeSelectorPlaceholder,
              {backgroundColor: colors.card},
            ]}
          />
        }>
        <TimeRangeSlider
          timeRange={timeRange}
          onTimeChange={setTimeRange}
          colors={colors}
        />
      </Suspense>

      <Suspense
        fallback={
          <View
            style={[
              styles.dateSelectorPlaceholder,
              {backgroundColor: colors.card},
            ]}
          />
        }>
        <DateSelector
          dates={dateRange}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </Suspense>

      {isLoading && classes.length === 0 ? (
        <ClassesListSkeleton />
      ) : (
        <Suspense fallback={<ClassesListSkeleton />}>
          <ClassList
            classes={classes}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={ListEmptyComponent}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </Suspense>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    height: 48,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  timeSelectorPlaceholder: {
    height: 48,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  dateSelectorPlaceholder: {
    height: 64,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
