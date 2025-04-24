import {useMemo} from 'react';
import {
  useDiscoverClassSearch,
  DiscoverClassSearchParams,
} from './useClassesDiscover';
import {IDiscoverClass} from '@/types/class.interfaces';

export const useClassesData = (classParams: DiscoverClassSearchParams) => {
  const {data, isLoading, refetch} = useDiscoverClassSearch(classParams);
  const classes = useMemo(() => {
    if (!data) return [];
    return data?.map((classItem: IDiscoverClass) => ({
      id: classItem.id,
      name: classItem.name,
      covers: classItem.covers || [],
      date: classItem.date,
      duration: classItem.duration,
      venue: {name: classItem.venue?.name || ''},
      instructorInfo: classItem.instructorInfo || '',
      categories: classItem.categories || [],
      scheduled: classItem.scheduled || false,
      scheduledSpots: classItem.scheduledSpots || 0,
      totalSpots: classItem.totalSpots || 0,
    }));
  }, [data]);

  return {classes, isLoading, refetch};
};
