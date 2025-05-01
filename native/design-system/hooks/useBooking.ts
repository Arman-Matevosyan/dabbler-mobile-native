import { ClassQueryKeys } from '@/constants/queryKeys';
import { ActivityAPI } from '@/services/api';
import { IClassBookingResponse } from '@/types/class.interfaces';
import { useMutation } from '@tanstack/react-query';

export interface UseClassBookProps {
  venueId?: string | null;
  startDate?: string | null;
  classId?: string | null;
}

export const useClassBook = () => {
  const mutation = useMutation<IClassBookingResponse, Error, UseClassBookProps>({
    mutationKey: [ClassQueryKeys.classBooking],
    mutationFn: async params => ActivityAPI.bookClass(params),
    retry: 0,
  });

  return {
    confirmClassBooking: mutation,
    isLoading: mutation.isPending,
    error: mutation.error,
    bookMutationFn: mutation,
    isSuccess: mutation.isSuccess,
  };
};

export interface UseCancelBookingProps {
  classId: string;
  date: string;
}

export const useCancelBooking = () => {
  const mutation = useMutation<IClassBookingResponse, Error, UseCancelBookingProps>({
    mutationKey: [ClassQueryKeys.cancelBooking],
    mutationFn: ({ classId, date }) => ActivityAPI.cancelBooking(classId, date),
    retry: 0,
  });

  return {
    cancelBookingMutation: mutation,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};
