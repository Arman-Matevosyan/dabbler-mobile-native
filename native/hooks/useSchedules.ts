import {ClassQueryKeys} from '@/constants/queryKeys';
import {ContentAPI} from '@/services/api';
import {IScheduleItem} from '@/types/class.interfaces';
import {useQuery} from '@tanstack/react-query';

export const useMyschedules = () => {
  const {data, isLoading, error, refetch} = useQuery<IScheduleItem[]>({
    queryKey: [ClassQueryKeys.schedules],
    queryFn: async () => {
      const response = await ContentAPI.getUserSchedules();
      return response.response || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
