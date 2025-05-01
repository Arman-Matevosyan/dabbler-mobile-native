import { ClassQueryKeys } from '@/constants/queryKeys';
import { ContentAPI } from '@/services/api';
import { ClassDetailResponse, IClass } from '@/types/class.interfaces';
import { useQuery } from '@tanstack/react-query';
interface UseDetailedClassProps {
  id: string;
  date?: string;
}

// Helper function to convert API response to our type
const mapResponseToClassDetail = (apiData: any, id: string): ClassDetailResponse => {
  return {
    id: apiData.id || id,
    name: apiData.name || '',
    description: apiData.description,
    date: apiData.startDate || apiData.date,
    duration: apiData.duration,
    instructorName: apiData.instructor || '',
    instructorInfo: apiData.instructor || apiData.instructorName || '',
    categories: Array.isArray(apiData.category)
      ? apiData.category
      : apiData.category
        ? [apiData.category]
        : [],
    venue: apiData.venue
      ? {
          id: apiData.venue.id,
          name: apiData.venue.name,
          address: apiData.venue.address,
          openingHours: apiData.venue.openingHours,
          websiteUrl: apiData.venue.websiteUrl,
          coordinates:
            apiData.venue.coordinates ||
            (apiData.location
              ? {
                  latitude: apiData.location.latitude,
                  longitude: apiData.location.longitude,
                }
              : undefined),
        }
      : undefined,
    scheduledSpots: apiData.attendees || apiData.scheduledSpots || 0,
    totalSpots: apiData.capacity || apiData.totalSpots || 0,
    covers: apiData.covers || [],
    equipment: apiData.equipment,
    level: apiData.level,
    location: apiData.location,
    importantInfo: apiData.importantInfo,
    isFree: !apiData.startDate,
    cancelDate: apiData.cancelDate || null,
  };
};

const fetchClassDetails = async (params: UseDetailedClassProps): Promise<ClassDetailResponse> => {
  try {
    const requestParams: Record<string, any> = {};

    if (params.date) {
      requestParams.date = params.date;
    }

    const response = await ContentAPI.getClassDetails(params.id, requestParams);
    const apiData = response || {};

    return mapResponseToClassDetail(apiData, params.id);
  } catch (error) {
    console.error('Error fetching class details:', error);
    throw error;
  }
};

export function useClassDetailsData(params: UseDetailedClassProps) {
  const queryKey = [ClassQueryKeys.classDetails, params.id, params.date];
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchClassDetails(params),
    enabled: Boolean(params.id),
    retry: 1,
  });

  return {
    classData: data,
    isLoading,
    error,
    refetch,
  };
}
