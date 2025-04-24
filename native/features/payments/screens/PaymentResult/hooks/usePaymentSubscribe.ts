import {PaymentQueryKeys, UserQueryKeys} from '@/constants/queryKeys';
import {PaymentAPI} from '@/services/api';
import {ISubscriptionCreateRequest} from '@/types/payment.interfaces';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';

export const usePaymentSubscribe = () => {
  const {t} = useTranslation();
  const queryClient = useQueryClient();

  const {
    mutate,
    data,
    isPending,
    isSuccess,
    error,
    reset,
    mutateAsync,
    status,
  } = useMutation({
    mutationFn: (subData: ISubscriptionCreateRequest) => {
      try {
        return PaymentAPI.subscribe(subData);
      } catch (error) {
        console.error('Verification error:', error);
        throw new Error(t('payment.subscription.failed'));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.createSubscription],
      });
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.subscriptions],
      });
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.plans],
      });
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.paymentMethods],
      });
      await queryClient.invalidateQueries({
        queryKey: [UserQueryKeys.userData],
      });
    },
  });

  return {
    mutate,
    mutateAsync,
    data,
    isPending,
    isSuccess,
    error,
    reset,
    status,
  };
};
