import { PaymentQueryKeys } from '@/constants/queryKeys';
import { PaymentAPI } from '@/services/api';
import { IPlan } from '@/types/venues.interfaces';
import { useQuery } from '@tanstack/react-query';

export const usePlans = () => {
  return useQuery<IPlan[]>({
    queryKey: [PaymentQueryKeys.plans],
    queryFn: () => PaymentAPI.getPlans(),
  });
};
