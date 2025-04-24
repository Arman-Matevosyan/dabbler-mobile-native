import {PaymentQueryKeys} from '@/constants/queryKeys';
import {PaymentAPI} from '@/services/api';
import {IPaymentMethod} from '@/types/payment.interfaces';
import {useQuery} from '@tanstack/react-query';

export const usePaymentMethods = () => {
  return useQuery<IPaymentMethod[]>({
    queryKey: [PaymentQueryKeys.paymentMethods],
    queryFn: () => PaymentAPI.getPaymentMethods(),
    retry: false,
  });
};
