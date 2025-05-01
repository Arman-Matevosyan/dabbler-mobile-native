import { Skeleton, Text, useTheme } from '@/design-system';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import React, { useLayoutEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckinDetailsBottomSheet,
  CheckinDetailsStatus,
} from '@/design-system/components/CheckinDetailsBottomSheet';
import { useTranslation } from 'react-i18next';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      style={styles.backButton}
      onPress={onPress}
      android_ripple={{ color: 'transparent' }}>
      <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
    </Pressable>
  );
};

const HeaderTabs = ({
  activeTab,
  onChangeTab,
}: {
  activeTab: 'history' | 'limits';
  onChangeTab: (tab: 'history' | 'limits') => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.headerTabsContainer}>
      <View style={styles.tabsContainer}>
        <Pressable
          style={styles.tabTextContainer}
          onPress={() => onChangeTab('history')}
          android_ripple={{ color: 'transparent' }}
          pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'history' ? colors.accent : colors.textSecondary,
              },
            ]}>
            {t('profile.history.title')}
          </Text>
          {activeTab === 'history' && (
            <View style={[styles.tabIndicator, { backgroundColor: colors.accent }]} />
          )}
        </Pressable>

        <Pressable
          style={styles.tabTextContainer}
          onPress={() => onChangeTab('limits')}
          android_ripple={{ color: 'transparent' }}
          pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'limits' ? colors.accent : colors.textSecondary,
              },
            ]}>
            {t('profile.history.checkinHistory')}
          </Text>
          {activeTab === 'limits' && (
            <View style={[styles.tabIndicator, { backgroundColor: colors.accent }]} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const CheckinSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
      <View style={styles.monthHeader}>
        <Skeleton width={120} height={24} style={styles.skeletonHeader} />
      </View>

      {[1, 2, 3].map((_, index) => (
        <View key={index} style={[styles.classCard, { backgroundColor: colors.background }]}>
          <View style={styles.imageContainer}>
            <Skeleton width={80} height={80} borderRadius={6} />
          </View>

          <View style={styles.detailsContainer}>
            <Skeleton width={150} height={18} style={{ marginBottom: 8 }} />
            <Skeleton width={180} height={14} style={{ marginBottom: 8 }} />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.textSecondary,
                  opacity: 0.3,
                  marginRight: 6,
                }}
              />
              <Skeleton width={100} height={14} />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.textSecondary,
                  opacity: 0.3,
                  marginRight: 6,
                }}
              />
              <Skeleton width={120} height={14} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.textSecondary,
                  opacity: 0.3,
                  marginRight: 6,
                }}
              />
              <Skeleton width={150} height={14} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.noCheckinsTitle}>{t('profile.history.noCheckins')}</Text>

      <Text style={styles.noCheckinsMessage}>{t('profile.history.emptyStateMessage')}</Text>
    </View>
  );
};

interface ClassHistoryItemProps {
  item: {
    id: string;
    name: string;
    date?: string;
    venue?: { name: string; address?: string };
    instructorInfo?: string;
    instructorName?: string;
    covers?: { url: string }[];
    duration?: number;
    status?: string;
  };
  onPress: (id: string, date?: string) => void;
}

const ClassHistoryItem = ({ item, onPress }: ClassHistoryItemProps) => {
  const { colors } = useTheme();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const coverImage =
    item.covers && item.covers.length > 0 && item.covers[0]?.url
      ? item.covers[0].url
      : `https://picsum.photos/400/200?random=${item.id}`;

  let dateTimeStr = '';

  if (item.date) {
    try {
      const scheduleDate = parseISO(item.date);
      const day = format(scheduleDate, 'EEE');
      const monthDay = format(scheduleDate, 'dd MMM');
      const startTime = format(scheduleDate, 'HH:mm');
      const endTime = format(
        new Date(scheduleDate.getTime() + (item.duration || 60) * 60 * 1000),
        'HH:mm',
      );

      dateTimeStr = `${day}, ${monthDay} - ${startTime}-${endTime}`;
    } catch (error) {
      console.error('Date parsing error:', error);
    }
  }

  const handleItemPress = () => {
    setShowBottomSheet(true);
    // Still call the original onPress handler in case we need the navigation elsewhere
    onPress(item.id, item.date);
  };

  // Convert the status string to CheckinDetailsStatus type
  const getCheckinStatus = (): CheckinDetailsStatus => {
    if (item.status === 'confirmed') return 'confirmed';
    if (item.status === 'cancelled') return 'cancelled';
    if (item.status === 'expired') return 'expired';
    return 'pending';
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.classCard, { backgroundColor: colors.card }]}
        activeOpacity={0.7}
        onPress={handleItemPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: coverImage }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={[styles.className, { color: colors.textPrimary }]}>{item.name}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialIcons
                name="calendar-today"
                size={16}
                color={colors.textSecondary}
                style={styles.icon}
              />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>{dateTimeStr}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="location-on"
                size={16}
                color={colors.textSecondary}
                style={styles.icon}
              />
              <Text style={[styles.venueText, { color: colors.textSecondary }]}>
                {item.venue?.name || ''}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="person"
                size={16}
                color={colors.textSecondary}
                style={styles.icon}
              />
              <Text style={[styles.instructorText, { color: colors.textSecondary }]}>
                {item.instructorInfo || item.instructorName || ''}
              </Text>
            </View>
          </View>

          {item.status === 'confirmed' && (
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
              <Text style={[styles.statusText, { color: colors.success }]}>Booking Confirmed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <CheckinDetailsBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        status={getCheckinStatus()}
        classDetails={item}
      />
    </>
  );
};

interface RenderClassItemProps {
  item: ClassHistoryItemProps['item'];
  handleClassPress: (id: string, date?: string) => void;
}

const renderClassItem = ({ item, handleClassPress }: RenderClassItemProps) => {
  return <ClassHistoryItem item={item} onPress={handleClassPress} />;
};

const HistoryContent = ({ checkIn }: { checkIn: ClassHistoryItemProps['item'][] }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const handleClassPress = (classId: string, date?: string) => {
    // We'll keep this navigation function but it won't be called directly now
    // since we're showing the bottom sheet instead
    // navigation.navigate('ClassDetails', { id: classId, date });
  };

  if (!checkIn || checkIn.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={checkIn}
      renderItem={({ item }) => renderClassItem({ item, handleClassPress })}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

// Limits tab content
const LimitsContent = () => {
  const { colors, mode } = useTheme();

  const username = 'Vahan!';

  return (
    <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
      <Text style={styles.welcomeTitle}>Hi {username}</Text>

      <Text style={[styles.welcomeDescription, { color: colors.textSecondary }]}>
        {'checkin.trackLimits'}
      </Text>

      <View style={styles.limitSection}>
        <View style={styles.limitHeader}>
          <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.limitHeaderText}>{'checkin.resetDates'}</Text>
        </View>

        <Text style={[styles.limitText, { color: colors.textSecondary }]}>
          {'checkin.totalCheckinsReset'}
        </Text>

        <Text style={[styles.limitText, { color: colors.textSecondary, marginTop: 16 }]}>
          {'checkin.allVenueLimits'}
        </Text>
      </View>

      <Text style={styles.monthSection}>March</Text>

      <View
        style={[styles.venueCard, { backgroundColor: mode === 'dark' ? '#222429' : '#F7F7F7' }]}>
        <Text style={styles.venueCardTitle}>{'checkin.venueCheckins'}</Text>
        <Text style={[styles.visitCount, { color: colors.textSecondary }]}>
          3 {'checkin.visitsInMarch'}
        </Text>

        <View style={styles.venueItem}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1547919307-1ecb10702e6f',
            }}
            style={styles.venueImage}
          />
          <Text style={styles.venueName}>Chimosa</Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.accent }]} />
            <View
              style={[
                styles.progressBackground,
                {
                  backgroundColor: mode === 'dark' ? '#333' : '#E0E0E0',
                },
              ]}
            />
          </View>

          <View style={styles.limitNumbers}>
            <Text style={{ color: colors.accent }}>3</Text>
            <Text style={{ color: colors.textSecondary }}>4</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ProfileCheckinScreen() {
  const { colors, mode } = useTheme();
  const [activeTab, setActiveTab] = useState<'history' | 'limits'>('history');
  const checkInData: ClassHistoryItemProps['item'][] = [];
  const isLoading = false;
  const router = useNavigation();
  useLayoutEffect(() => {
    StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [mode]);

  const handleGoBack = () => {
    router.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <HeaderBackButton onPress={handleGoBack} />
        <Text style={styles.headerTitle}>{'checkin.checkins'}</Text>
        <View style={styles.headerRight} />
      </View>

      <HeaderTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      <View style={styles.content}>
        {isLoading ? (
          <CheckinSkeleton />
        ) : activeTab === 'history' ? (
          <HistoryContent checkIn={checkInData} />
        ) : (
          <LimitsContent />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerTabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 48,
  },
  tabTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: 60,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  monthHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 24,
  },
  classCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    padding: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
  },
  venueText: {
    fontSize: 14,
  },
  instructorText: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  limitSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  limitText: {
    fontSize: 14,
    lineHeight: 20,
  },
  monthSection: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  venueCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
  },
  venueCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  visitCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  venueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  venueImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
  venueName: {
    fontSize: 15,
    fontWeight: '500',
    width: 80,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    marginHorizontal: 8,
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    height: 4,
    width: '75%',
    borderRadius: 2,
  },
  progressBackground: {
    position: 'absolute',
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
  limitNumbers: {
    flexDirection: 'row',
    width: 24,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonHeader: {
    marginBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noCheckinsTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noCheckinsMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  listContentContainer: {
    paddingVertical: 16,
  },
});
