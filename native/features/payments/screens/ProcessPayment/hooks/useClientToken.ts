import {PaymentQueryKeys} from '@/constants/queryKeys';
import {PaymentAPI} from '@/services/api';
import {IPaymentGatewayToken} from '@/types/payment.interfaces';
import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';

export const useClientToken = () => {
  const {t} = useTranslation();
  
  return useQuery<IPaymentGatewayToken[]>({
    queryKey: [PaymentQueryKeys.gatewayToken],
    queryFn: () => {
      const response = PaymentAPI.getClientToken();
      if (!response) {
        throw new Error(t('payment.noClientToken'));
      }
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
