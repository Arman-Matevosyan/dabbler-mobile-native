import {PaymentQueryKeys} from '@/constants/queryKeys';
import {PaymentAPI} from '@/services/api';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';

export const useVerifyPayment = (nonceData?: string) => {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: [PaymentQueryKeys.paymentSuccess, nonceData],
    queryFn: () => {
      try {
        return PaymentAPI.verifyPayment(nonceData);
      } catch (error) {
        console.error('Verification error:', error);
        throw new Error(t('payment.verificationFailed'));
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!nonceData,
  });

  if (isSuccess) {
    queryClient.invalidateQueries({
      queryKey: [PaymentQueryKeys.paymentMethods],
    });
    queryClient.invalidateQueries({
      queryKey: [PaymentQueryKeys.subscriptions],
    });
  }

  return {
    isLoading,
    data,
    error: null,
    isSuccess,
    refetch: () => {},
  };
};
