import { useQuery } from '@tanstack/react-query';
import { UserAPI } from '@/services/api';
import { UserQueryKeys } from '@/constants/queryKeys';
import { useAuthStore } from '@/stores/authStore';

export const useUser = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [UserQueryKeys.userData],
    queryFn: async () => {
      return await UserAPI.getCurrentUser();
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};
