import { client } from '../client';
import { IClassBookingResponse } from '@/types/class.interfaces';
import { IVenuesListResponse } from '@/types/venues.interfaces';

export const ActivityAPI = {
  getFavorites: async (userId: string): Promise<IVenuesListResponse['response']> => {
    const response = await client.get('/content/venues/discover/favorites/me', {
      params: { userId, offset: 0, limit: 100 },
    });
    return (response as any).response;
  },

  addFavorite: async (venueId: string): Promise<any> => {
    const response = await client.post('/activity/favorites/me', {
      venueId,
    });
    return (response as any).response;
  },

  removeFavorite: async (venueId: string): Promise<any> => {
    const response = await client.delete('/activity/favorites/me', {
      params: { venueId },
    });
    return (response as any).response;
  },

  bookClass: async (params: any): Promise<IClassBookingResponse> => {
    const response = await client.post('/activity/schedules/me', params);
    return (response as any).data;
  },

  cancelBooking: async (classId: string, date: string): Promise<IClassBookingResponse> => {
    const response = await client.post('/activity/schedules/me/cancel', {
      classId: classId,
      startDate: date,
    });
    return (response as any).data;
  },
};
