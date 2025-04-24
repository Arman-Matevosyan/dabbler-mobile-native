import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {EmptyState} from '@/design-system';
import {ClassCard} from '@/components/ClassCard';
import {SkeletonCard} from './SkeletonCard';

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

interface ApiClassItem {
  id: string;
  name: string;
  covers?: Array<{url: string}>;
  date?: string;
  duration: number;
  venue?: {name: string};
  instructorInfo?: string;
  categories?: string[];
  scheduledSpots?: number;
  totalSpots?: number;
}

interface ClassContentProps {
  isLoading: boolean;
  error: Error | null;
  freeClasses: ApiClassItem[];
  scheduledClasses: ApiClassItem[];
}

export const ClassContent: React.FC<ClassContentProps> = ({
  isLoading,
  error,
  freeClasses,
  scheduledClasses,
}) => {
  if (isLoading) {
    return (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {Array.from({length: 3}).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={styles.contentContainer}>
        <EmptyState
          title={'classes.unableToLoadClasses'}
          message={error instanceof Error ? error.message : 'common.error'}
        />
      </View>
    );
  }

  if (!scheduledClasses?.length && !freeClasses.length) {
    return (
      <View style={styles.contentContainer}>
        <EmptyState
          title={'classes.noClassesAvailable'}
          message={'classes.noClassesScheduled'}
        />
      </View>
    );
  }

  const mapToClassItem = (
    classItem: ApiClassItem,
    isScheduled: boolean,
  ): ClassItem => ({
    id: classItem.id,
    name: classItem.name,
    covers: classItem.covers || [],
    date: classItem.date,
    duration: classItem.duration,
    venue: {name: classItem.venue?.name || ''},
    instructorInfo: classItem.instructorInfo || '',
    categories: classItem.categories || [],
    scheduled: isScheduled,
    scheduledSpots: classItem.scheduledSpots || 0,
    totalSpots: classItem.totalSpots || 0,
  });

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {freeClasses.map(classItem => (
        <ClassCard
          key={`free-${classItem.id}`}
          classItem={mapToClassItem(classItem, false)}
        />
      ))}
      {scheduledClasses?.map(classItem => (
        <ClassCard
          key={`scheduled-${classItem.id}`}
          classItem={mapToClassItem(classItem, true)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
