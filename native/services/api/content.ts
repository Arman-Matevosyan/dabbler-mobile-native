import { client } from '../client';
import { ICategoriesResponse } from '@/types/categories.interfaces';
import {
  ICheckinsResponse,
  IClassDetailResponse,
  IClassesListResponse,
  IDiscoverClassCheckinsResponse,
  IDiscoverClassDetailResponse,
  IDiscoverClassSchedulesResponse,
  IDiscoverClassSearchResponse,
  IDiscoverSchedulesResponse,
  IDiscoverVenueClassesResponse,
  ISchedulesResponse,
  IVenueClassesResponse,
} from '@/types/class.interfaces';
import { IVenueResponse, IVenuesListResponse } from '@/types/venues.interfaces';

interface ApiResponse<T> {
  response: T;
  metadata: Record<string, any>;
}

export const ContentAPI = {
  getVenueDetails: async (venueId: string): Promise<IVenueResponse> => {
    const response = await client.get<ApiResponse<IVenueResponse>>(
      `/content/venues/discover/${venueId}`,
    );
    return response.response;
  },

  searchVenues: async (params: any): Promise<IVenuesListResponse> => {
    const response = await client.get<ApiResponse<IVenuesListResponse>>(
      '/content/venues/discover/search',
      params,
    );
    return response.response;
  },

  searchVenuesOnMap: async (params: any): Promise<IVenuesListResponse> => {
    const response = await client.get<ApiResponse<IVenuesListResponse>>(
      '/content/venues/discover/map/search',
      params,
    );
    return response.response;
  },

  getFavoriteVenues: async (): Promise<IVenuesListResponse> => {
    const response = await client.get<ApiResponse<IVenuesListResponse>>(
      '/content/venues/discover/favorites/me',
      {},
      { withAuth: true },
    );
    return response.response;
  },

  // Class related endpoints
  searchClasses: async (params: any): Promise<IClassesListResponse> => {
    const response = await client.get<ApiResponse<IClassesListResponse>>(
      '/content/classes/discover/search',
      params,
    );
    return response.response;
  },

  getClassDetails: async (classId: string, params?: any): Promise<IClassDetailResponse> => {
    const response = await client.get<ApiResponse<IClassDetailResponse>>(
      `/content/classes/discover/${classId}`,
      params,
    );
    return response.response;
  },

  getVenueClasses: async (params: any): Promise<IVenueClassesResponse> => {
    const response = await client.get<ApiResponse<IVenueClassesResponse>>(
      '/content/classes/discover/venue',
      params,
    );
    return response.response;
  },

  getUserSchedules: async (): Promise<ISchedulesResponse> => {
    const response = await client.get<ApiResponse<ISchedulesResponse>>(
      '/content/classes/discover/me/schedules',
      {},
      { withAuth: true },
    );
    return response.response;
  },

  getUserCheckins: async (): Promise<ICheckinsResponse> => {
    const response = await client.get<ApiResponse<ICheckinsResponse>>(
      '/content/classes/discover/me/checkins',
      {},
      { withAuth: true },
    );
    return response.response;
  },

  discoverClassSearch: async (params: any): Promise<IDiscoverClassSearchResponse> => {
    const response = await client.get<ApiResponse<IDiscoverClassSearchResponse>>(
      '/content/classes/discover/search',
      params,
    );
    return response.response;
  },

  discoverVenueClasses: async (
    venueId: string,
    params?: any,
  ): Promise<IDiscoverVenueClassesResponse> => {
    const response = await client.get<ApiResponse<IDiscoverVenueClassesResponse>>(
      `/content/classes/discover/venue`,
      {
        venue_id: venueId,
        ...params,
      },
    );
    console.log(response);
    return response.response;
  },

  discoverUserCheckins: async (): Promise<IDiscoverClassCheckinsResponse> => {
    const response = await client.get<ApiResponse<IDiscoverClassCheckinsResponse>>(
      '/content/classes/discover/me/checkins',
      {},
      { withAuth: true },
    );
    return response.response;
  },

  discoverUserSchedules: async (): Promise<IDiscoverClassSchedulesResponse> => {
    const response = await client.get<ApiResponse<IDiscoverClassSchedulesResponse>>(
      '/content/classes/discover/me/schedules',
      {},
      { withAuth: true },
    );
    return response.response;
  },

  discoverAllSchedules: async (params?: any): Promise<IDiscoverSchedulesResponse> => {
    const response = await client.get<ApiResponse<IDiscoverSchedulesResponse>>(
      '/content/classes/discover/schedules',
      params,
    );
    return response.response;
  },

  discoverClassDetail: async (classId: string): Promise<IDiscoverClassDetailResponse> => {
    const response = await client.get<ApiResponse<IDiscoverClassDetailResponse>>(
      `/content/classes/discover/${classId}`,
    );
    return response.response;
  },

  getCategories: async (params?: any): Promise<ICategoriesResponse> => {
    const response = await client.get<ApiResponse<ICategoriesResponse>>(
      '/content/categories',
      params,
    );
    return response.response;
  },
};
