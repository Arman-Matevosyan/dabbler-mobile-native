import { UserQueryKeys, VenueQueryKeys } from '@/constants/queryKeys';
import { ActivityAPI } from '@/services/api';
import { IFullVenue } from '@/types/venues.interfaces';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UserData {
  userId: string;
  [key: string]: any;
}

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const userData = queryClient.getQueryData<UserData>([UserQueryKeys.userData]) || null;
  const userId = userData?.userId;

  const {
    data: favoriteVenues = [],
    isLoading,
    error,
    refetch,
  } = useQuery<IFullVenue[]>({
    queryKey: [VenueQueryKeys.favorites, userId],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1] as string;
      return ActivityAPI.getFavorites(id);
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 15 * 60 * 1000,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (venueId: string) => ActivityAPI.addFavorite(venueId),
    onMutate: async venueId => {
      await queryClient.cancelQueries({
        queryKey: [VenueQueryKeys.favorites, userId],
      });

      const previousFavorites =
        queryClient.getQueryData<IFullVenue[]>([VenueQueryKeys.favorites, userId]) || [];

      const optimisticVenue = {
        id: venueId,
        _optimistic: true,
        name: 'Loading...',
        description: '',
        address: {},
        location: { type: 'Point', coordinates: [] },
        covers: [],
      } as unknown as IFullVenue;

      queryClient.setQueryData(
        [VenueQueryKeys.favorites, userId],
        [...previousFavorites, optimisticVenue],
      );

      queryClient.setQueriesData(
        {
          queryKey: [VenueQueryKeys.venueDetails, venueId],
        },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isFavorite: true,
          };
        },
      );

      return { previousFavorites };
    },
    onError: (error, venueId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData([VenueQueryKeys.favorites, userId], context.previousFavorites);

        queryClient.setQueriesData(
          {
            queryKey: [VenueQueryKeys.venueDetails, venueId],
          },
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              isFavorite: false,
            };
          },
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [VenueQueryKeys.favorites, userId],
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (venueId: string) => ActivityAPI.removeFavorite(venueId),
    onMutate: async venueId => {
      await queryClient.cancelQueries({
        queryKey: [VenueQueryKeys.favorites, userId],
      });

      const previousFavorites =
        queryClient.getQueryData<IFullVenue[]>([VenueQueryKeys.favorites, userId]) || [];

      queryClient.setQueryData(
        [VenueQueryKeys.favorites, userId],
        previousFavorites.filter(fav => fav.id !== venueId),
      );

      queryClient.setQueriesData(
        {
          queryKey: [VenueQueryKeys.venueDetails, venueId],
        },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isFavorite: false,
          };
        },
      );

      return { previousFavorites };
    },
    onError: (error, venueId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData([VenueQueryKeys.favorites, userId], context.previousFavorites);

        queryClient.setQueriesData(
          {
            queryKey: [VenueQueryKeys.venueDetails, venueId],
          },
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              isFavorite: true,
            };
          },
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [VenueQueryKeys.favorites, userId],
      });
    },
  });

  const toggleFavorite = useCallback(
    async (venueId: string) => {
      if (!userId) {
        throw new Error('User must be logged in to modify favorites');
      }

      const isFavorite = favoriteVenues.some(fav => fav.id === venueId);

      if (isFavorite) {
        return removeFavoriteMutation.mutateAsync(venueId);
      } else {
        return addFavoriteMutation.mutateAsync(venueId);
      }
    },
    [userId, favoriteVenues, addFavoriteMutation, removeFavoriteMutation],
  );

  return {
    favorites: favoriteVenues,
    isLoading: isLoading || addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
    error,
    toggleFavorite,
    refetch,
    isFavorite: useCallback(
      (venueId: string) => favoriteVenues.some(fav => fav.id === venueId),
      [favoriteVenues],
    ),
  };
};
