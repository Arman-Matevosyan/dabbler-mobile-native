import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {format} from 'date-fns';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ClassBookingWrapper, useTheme} from '@/design-system';
import {useMyschedules} from '@/hooks/useSchedules';
import {useAuthStore} from '@/stores/authStore';
import {useClassDetailsData} from './hooks/useClassDetailsData';
import {
  BookingInfo,
  ClassDescription,
  ClassDetailsSkeleton,
  ClassHeader,
  ClassImageSlider,
  ClassInfo,
  ClassLocationMap,
  ClassMeta,
} from './components';
import {Share} from 'react-native';
import {useTranslation} from 'react-i18next';

let Calendar: any;
try {
  Calendar = require('expo-calendar');
} catch (error) {
  console.warn('expo-calendar module could not be loaded:', error);
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Venue {
  id: string;
  name: string;
  address?: any;
  openingHours?: any[];
  websiteUrl?: string;
  coordinates?: Coordinates | any;
  covers?: Array<{url: string; id?: string}>;
}

interface ClassDetail {
  id: string;
  name: string;
  date?: string;
  description?: string;
  duration?: number;
  covers?: Array<{url: string; id?: string}>;
  categories?: string[];
  venue?: Venue;
  instructorInfo?: string;
  cancelDate?: string;
  scheduledSpots?: number;
  totalSpots?: number;
  isFree?: boolean;
  location?: {
    type: string;
    coordinates: number[];
  };
  importantInfo?: string;
}

interface Schedule {
  id: string;
  [key: string]: any;
}

export default function ClassDetailsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const {id = '', date} = route.params || {};

  const {colors} = useTheme();
  const {isAuthenticated} = useAuthStore();

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const {classData, isLoading, error} = useClassDetailsData({id, date});

  const processedClassData = useMemo(() => {
    if (!classData) return null;

    const data = {...classData};

    if (
      data.venue &&
      (!data.venue.coordinates ||
        Object.keys(data.venue.coordinates).length === 0) &&
      data.location?.coordinates?.length >= 2
    ) {
      data.venue.coordinates = {
        longitude: data.location.coordinates[0],
        latitude: data.location.coordinates[1],
      };
    }

    return data;
  }, [classData]);

  const {data: schedulesData, refetch: refetchSchedules} = useMyschedules();

  const isClassBooked = useMemo(() => {
    if (!schedulesData || !processedClassData) return false;
    return (schedulesData as Schedule[]).some(
      schedule => schedule.id === processedClassData.id,
    );
  }, [schedulesData, processedClassData]);

  useEffect(() => {
    Animated.timing(scrollY, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    refetchSchedules();
  }, [refetchSchedules]);

  const closeScreen = () => {
    Animated.timing(scrollY, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  const handleShareClass = async () => {
    if (!processedClassData) return;

    try {
      await Share.share({
        message: `Join me for ${processedClassData.name} at ${
          processedClassData.venue?.name
        } on ${
          processedClassData.date
            ? format(new Date(processedClassData.date), 'MMM d, yyyy h:mm a')
            : 'TBD'
        }!`,
      });
    } catch (error) {
      console.error('Error sharing class:', error);
    }
  };

  const handleAddToCalendar = async () => {
    if (!processedClassData?.date || !Calendar) {
      console.warn(
        'Cannot add to calendar: Calendar module not available or no date provided',
      );
      return;
    }

    try {
      const classStartDate = new Date(processedClassData.date);
      if (isNaN(classStartDate.getTime())) return;

      const {status} = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') return;

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      );
      const defaultCalendar = findDefaultCalendar(calendars);
      if (!defaultCalendar) return;

      const classEndDate = new Date(
        classStartDate.getTime() + (processedClassData.duration || 60) * 60000,
      );

      const eventDetails = {
        title: processedClassData.name || 'Class Booking',
        startDate: classStartDate,
        endDate: classEndDate,
        location: processedClassData.venue?.name || '',
        notes: processedClassData.description || 'Booking confirmed',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        alarms: [{relativeOffset: -60}],
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
  };

  const findDefaultCalendar = (calendars: any[]) => {
    if (!Calendar) return null;

    let defaultCalendar;

    if (Platform.OS === 'ios') {
      defaultCalendar = calendars.find(
        cal => cal.allowsModifications && cal.source?.name === 'Default',
      );

      if (!defaultCalendar) {
        defaultCalendar = calendars.find(
          cal => cal.allowsModifications && cal.source?.name === 'iCloud',
        );
      }
    } else {
      defaultCalendar = calendars.find(
        cal =>
          cal.allowsModifications &&
          cal.accessLevel === Calendar.CalendarAccessLevel.OWNER &&
          cal.source?.type === 'com.google',
      );
    }

    if (!defaultCalendar) {
      defaultCalendar = calendars.find(cal => cal.allowsModifications);
    }

    return defaultCalendar || (calendars.length > 0 ? calendars[0] : null);
  };

  const goToVenue = () => {
    if (processedClassData?.venue?.id) {
      navigation.navigate('MainTabs', {
        screen: 'Venues',
        params: {
          screen: 'VenueDetails',
          params: {id: processedClassData.venue.id},
        },
      });
    }
  };

  if (isLoading) {
    return <ClassDetailsSkeleton onClose={closeScreen} />;
  }

  if (error || !processedClassData) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={[styles.header, {backgroundColor: colors.background}]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeScreen}
            activeOpacity={0.7}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.textPrimary}]}>
            {t('classes.details.classDetails')}
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#E53E3E" />
          <Text style={[styles.errorTitle, {color: colors.textPrimary}]}>
            {t('classes.details.errorTitle')}
          </Text>
          <Text style={[styles.errorText, {color: colors.textSecondary}]}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </Text>
          <TouchableOpacity
            style={[styles.tryAgainButton, {backgroundColor: colors.accent}]}
            onPress={closeScreen}>
            <Text style={[styles.tryAgainButtonText, {color: 'white'}]}>
              {t('classes.details.goBack')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const classDetail = processedClassData as unknown as ClassDetail;

  const formattedDate = classDetail.date
    ? format(new Date(classDetail.date), 'EEE, MMM d')
    : 'TBD';
  const formattedTime = classDetail.date
    ? format(new Date(classDetail.date), 'h:mm a')
    : 'TBD';
  const formattedClassDate = classDetail.date
    ? format(new Date(classDetail.date), 'EEE, d MMM, h:mm a')
    : 'TBD';
  const cancelDateStr = classDetail.cancelDate
    ? format(new Date(classDetail.cancelDate), 'EEE, MMM d, h:mm a')
    : '';

  const hasValidCoordinates = !!(
    classDetail.venue?.coordinates?.latitude &&
    classDetail.venue?.coordinates?.longitude
  );
  console.log(classDetail);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
        <ClassImageSlider
          covers={classDetail.covers}
          className={classDetail.name}
          onBackPress={closeScreen}
        />

        <View style={styles.contentContainer}>
          <ClassInfo
            title={classDetail.name || ''}
            formattedDate={formattedDate}
            formattedTime={formattedTime}
          />

          <View style={styles.detailsContainer}>
            <ClassMeta
              categories={classDetail.categories}
              venueName={classDetail.venue?.name}
              instructorInfo={classDetail.instructorInfo}
            />

            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
                {t('classes.details.aboutClass')}
              </Text>
              <ClassDescription description={classDetail.description} />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text
                  style={[styles.sectionTitle, {color: colors.textPrimary}]}>
                  {t('classes.details.venueDetails')}
                </Text>
                <TouchableOpacity onPress={goToVenue}>
                  <Text style={[styles.viewMoreText, {color: colors.accent}]}>
                    {t('classes.details.viewMore')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.venueContainer}>
                {classDetail.venue?.covers &&
                classDetail.venue.covers[0]?.url ? (
                  <Image
                    source={{uri: classDetail.venue.covers[0].url}}
                    style={styles.venueImage}
                  />
                ) : (
                  <View
                    style={[
                      styles.venueImagePlaceholder,
                      {backgroundColor: colors.border},
                    ]}
                  />
                )}

                <View style={styles.venueDetails}>
                  <Text style={[styles.venueName, {color: colors.textPrimary}]}>
                    {classDetail.venue?.name}
                  </Text>
                  <Text
                    style={[
                      styles.venueAddress,
                      {color: colors.textSecondary},
                    ]}>
                    {classDetail.venue?.address?.street}{' '}
                    {classDetail.venue?.address?.houseNumber}
                  </Text>
                  <Text
                    style={[
                      styles.venueAddress,
                      {color: colors.textSecondary},
                    ]}>
                    {classDetail.venue?.address?.city} -{' '}
                    {classDetail.venue?.address?.country}
                  </Text>
                </View>
              </View>
            </View>

            {classDetail.importantInfo && (
              <View style={styles.sectionContainer}>
                <Text
                  style={[styles.sectionTitle, {color: colors.textPrimary}]}>
                  Important Info
                </Text>
                <Text
                  style={[styles.importantInfo, {color: colors.textSecondary}]}>
                  {classDetail.importantInfo}
                </Text>
              </View>
            )}

            {hasValidCoordinates && (
              <View style={styles.sectionContainer}>
                <Text
                  style={[styles.sectionTitle, {color: colors.textPrimary}]}>
                  Location
                </Text>
                <ClassLocationMap
                  coordinates={classDetail.venue?.coordinates}
                  venueName={classDetail.venue?.name}
                />
              </View>
            )}

            <BookingInfo
              isClassBooked={isClassBooked}
              cancelDateStr={cancelDateStr}
              onAddToCalendar={handleAddToCalendar}
            />
          </View>
        </View>
      </Animated.ScrollView>

      <ClassHeader
        title={classDetail.name || ''}
        onClose={closeScreen}
        headerOpacity={headerOpacity}
        insets={insets}
      />

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom || 16 : 16,
          },
        ]}>
        <View style={styles.bookingContainer}>
          <Text style={[styles.priceText, {color: colors.textPrimary}]}>
            {classDetail.isFree ? 'Free' : 'Paid Class'}
          </Text>

          <ClassBookingWrapper
            classId={classDetail.id || ''}
            venueId={classDetail.venue?.id}
            className={classDetail.name}
            date={classDetail.date || ''}
            formattedDate={formattedClassDate}
            venue={classDetail.venue?.name}
            isClassBooked={isClassBooked}
            onBookingChange={refetchSchedules}
            onAddToCalendar={handleAddToCalendar}
            onShare={handleShareClass}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  venueImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  venueDetails: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  importantInfo: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 10,
  },
  bookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  bookButton: {
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  tryAgainButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
