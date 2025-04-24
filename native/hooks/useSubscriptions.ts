import {PaymentQueryKeys} from '@/constants/queryKeys';
import {PaymentAPI} from '@/services/api';
import {ISubscription} from '@/types/payment.interfaces';
import {useQuery} from '@tanstack/react-query';
import {useAuthStore} from '@/stores/authStore';

export const useSubscriptions = () => {
  return useQuery<ISubscription[], Error>({
    queryKey: [PaymentQueryKeys.subscriptions],
    queryFn: async () => {
      const response = await PaymentAPI.getSubscriptions();
      return response;
    },
    enabled: useAuthStore.getState().isAuthenticated,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
