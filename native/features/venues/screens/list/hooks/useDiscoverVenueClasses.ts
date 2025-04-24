import {ClassQueryKeys} from '@/constants/queryKeys';
import {ContentAPI} from '@/services/api';
import {IDiscoverVenueClassesResponse} from '@/types/class.interfaces';
import {useQuery} from '@tanstack/react-query';

export const useDiscoverVenueClasses = (
  venueId: string,
  params?: Record<string, any>,
) => {
  return useQuery<IDiscoverVenueClassesResponse>({
    queryKey: [ClassQueryKeys.discoverVenue, venueId, params],
    queryFn: () => ContentAPI.discoverVenueClasses(venueId, params),
    enabled: !!venueId,
  });
};
