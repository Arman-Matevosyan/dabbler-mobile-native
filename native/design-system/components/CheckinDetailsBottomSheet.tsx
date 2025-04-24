import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import NativeBottomSheet, {NativeBottomSheetRef} from '../../design-system/NativeBottomSheet';
import {Text, useTheme} from '..';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {format, parseISO} from 'date-fns';

const {width} = Dimensions.get('window');

export type CheckinDetailsStatus = 'confirmed' | 'cancelled' | 'expired' | 'pending';

interface CheckinDetailsProps {
  visible: boolean;
  onClose: () => void;
  status: CheckinDetailsStatus;
  classDetails: {
    id: string;
    name: string;
    date?: string;
    venue?: { name: string; address?: string };
    instructorInfo?: string;
    instructorName?: string;
    covers?: { url: string }[];
    duration?: number;
  };
  autoCloseAfter?: number;
}

export const CheckinDetailsBottomSheet: React.FC<CheckinDetailsProps> = ({
  visible,
  onClose,
  status,
  classDetails,
  autoCloseAfter,
}) => {
  const {colors, mode} = useTheme();
  const bottomSheetRef = useRef<NativeBottomSheetRef>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Format the date and time
  const formatDateTime = (dateString?: string, duration?: number) => {
    if (!dateString) return '';
    
    try {
      const scheduleDate = parseISO(dateString);
      const day = format(scheduleDate, 'EEE');
      const monthDay = format(scheduleDate, 'dd MMM');
      const startTime = format(scheduleDate, 'HH:mm');
      const endTime = format(
        new Date(scheduleDate.getTime() + (duration || 60) * 60 * 1000),
        'HH:mm',
      );

      return `${day}, ${monthDay} - ${startTime}-${endTime}`;
    } catch (error) {
      console.error('Date parsing error:', error);
      return '';
    }
  };

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (autoCloseAfter && autoCloseAfter > 0) {
        setTimeout(() => {
          handleClose();
        }, autoCloseAfter);
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible, autoCloseAfter]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    });
  };

  if (!isVisible) {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      case 'expired':
        return colors.accent;
      case 'pending':
        return colors.accent;
      default:
        return colors.accent;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'confirmed':
        return 'Check-in Successful';
      case 'cancelled':
        return 'Check-in Cancelled';
      case 'expired':
        return 'Check-in Expired';
      case 'pending':
        return 'Check-in Pending';
      default:
        return 'Check-in Status';
    }
  };

  const coverImage =
    classDetails.covers && classDetails.covers.length > 0 && classDetails.covers[0]?.url
      ? classDetails.covers[0].url
      : `https://picsum.photos/400/200?random=${classDetails.id}`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}>
      <NativeBottomSheet
        ref={bottomSheetRef}
        snapPoints={['70%']}
        enablePanDownToClose
        handleIndicatorStyle={{backgroundColor: colors.border}}
        backgroundStyle={{backgroundColor: colors.background}}
        handleStyle={{backgroundColor: colors.background}}
        index={0}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>

          <View style={styles.imageContainer}>
            <Image source={{uri: coverImage}} style={styles.image} />
          </View>

          <View style={styles.content}>
            <View style={[styles.statusContainer, { borderColor: getStatusColor() }]}>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {classDetails.name}
            </Text>

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.icon}
                />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  {formatDateTime(classDetails.date, classDetails.duration)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.icon}
                />
                <View>
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    {classDetails.venue?.name || ''}
                  </Text>
                  {classDetails.venue?.address && (
                    <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                      {classDetails.venue.address}
                    </Text>
                  )}
                </View>
              </View>

              {(classDetails.instructorInfo || classDetails.instructorName) && (
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="person"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.icon}
                  />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    {classDetails.instructorInfo || classDetails.instructorName}
                  </Text>
                </View>
              )}
            </View>

            {status === 'confirmed' && (
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.success }]}
                  onPress={handleClose}>
                  <Text style={styles.actionButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {(status === 'cancelled' || status === 'expired') && (
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.accent }]}
                  onPress={handleClose}>
                  <Text style={styles.actionButtonText}>Back to Classes</Text>
                </TouchableOpacity>
              </View>
            )}

            {status === 'pending' && (
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.accent }]}
                  onPress={handleClose}>
                  <Text style={styles.actionButtonText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton, 
                    styles.secondaryButton,
                    { backgroundColor: mode === 'dark' ? '#333' : '#f0f0f0' }
                  ]}
                  onPress={handleClose}>
                  <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </NativeBottomSheet>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailText: {
    fontSize: 16,
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    marginTop: 2,
  },
  actionContainer: {
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    marginTop: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 