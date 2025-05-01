import { useState, useMemo, useEffect, useCallback } from 'react';
import { useClassSearchFilters, useLocationParams, useSearchStore } from '@/stores/searchStore';

export const useDateTimeFilters = () => {
  const { updateClassParams, resetClassDates } = useSearchStore();
  const [timeRange, setTimeRange] = useState({ start: '05:00', end: '23:00' });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { query, category } = useClassSearchFilters();
  const { locationLat, locationLng, radius } = useLocationParams();

  const from_date = useMemo(() => {
    const [startH, startM] = timeRange.start.split(':').map(Number);
    const fromDate = new Date(selectedDate);
    fromDate.setHours(startH, startM, 0, 0);
    return fromDate;
  }, [selectedDate, timeRange.start]);

  const to_date = useMemo(() => {
    const [endH, endM] = timeRange.end.split(':').map(Number);
    const toDate = new Date(selectedDate);
    toDate.setHours(endH, endM, 59, 999);
    return toDate;
  }, [selectedDate, timeRange.end]);

  useEffect(() => {
    if (from_date > to_date) {
      setTimeRange(prev => ({ ...prev, end: '23:59' }));
    }
  }, [from_date, to_date]);

  useEffect(() => {
    updateClassParams({ from_date, to_date });
  }, [from_date, to_date, updateClassParams]);

  const resetDateTimeFilters = useCallback(() => {
    setTimeRange({ start: '05:00', end: '23:00' });
    setSelectedDate(new Date());
    resetClassDates();
  }, [resetClassDates]);

  const classParams = useMemo(
    () => ({
      latitude: locationLat,
      longitude: locationLng,
      distance: radius,
      query,
      category: category || [],
      from_date: from_date.toISOString(),
      to_date: to_date.toISOString(),
    }),
    [locationLat, locationLng, radius, query, category, from_date, to_date],
  );
  return {
    timeRange,
    setTimeRange,
    selectedDate,
    setSelectedDate,
    from_date,
    to_date,
    resetDateTimeFilters,
    classParams,
  };
};
