import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Button } from './Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export type BookingStatus = 'booking' | 'success' | 'cancelConfirm' | 'cancelled';

interface BookingStatusBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onBookConfirm?: () => void;
  onCancelConfirm?: () => void;
  onAddToCalendar?: () => void;
  onShare?: () => void;
  status: BookingStatus;
  className?: string;
  classDescription?: string;
  dateTime?: string;
  venue?: string;
  instructor?: string;
  price?: string;
  duration?: string;
  cancellationPolicy?: string;
  invalidateQueries?: () => void;
}

export const BookingStatusBottomSheet: React.FC<BookingStatusBottomSheetProps> = ({
  isVisible,
  onClose,
  onBookConfirm,
  onCancelConfirm,
  onAddToCalendar,
  status,
  className,
  classDescription,
  dateTime,
  venue,
  invalidateQueries,
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && (status === 'success' || status === 'cancelled')) {
      const timer = setTimeout(() => {
        onClose();
        if (invalidateQueries) {
          invalidateQueries();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, status, onClose, invalidateQueries]);

  const handleBookNow = async () => {
    if (onBookConfirm) {
      setLoading(true);
      try {
        onBookConfirm();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelBooking = async () => {
    if (onCancelConfirm) {
      setLoading(true);
      try {
        await onCancelConfirm();
        if (invalidateQueries) {
          invalidateQueries();
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const renderCheckIcon = (iconColor: string): React.ReactElement => (
    <View style={[styles.checkCircle, { borderColor: iconColor }]}>
      <MaterialIcons name="check" size={24} color={iconColor} />
    </View>
  );

  const renderBookingInfo = () => (
    <View style={[styles.infoContainer, { borderColor: colors.border }]}>
      {className && (
        <Text style={[styles.className, { color: colors.textPrimary }]}>{className}</Text>
      )}
      {dateTime && (
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>{dateTime}</Text>
        </View>
      )}
      {venue && (
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>{venue}</Text>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (status) {
      case 'booking':
        return (
          <ScrollView>
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Booking Details</Text>

              {renderBookingInfo()}

              {classDescription && (
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {classDescription}
                </Text>
              )}

              <Button
                title="Book Now"
                variant="primary"
                size="small"
                onPress={handleBookNow}
                style={styles.smallButton}
                loading={loading}
              />

              <Button
                title="Cancel"
                variant="outline"
                size="small"
                onPress={onClose}
                style={{
                  ...styles.smallOutlineButton,
                  borderColor: colors.border,
                }}
                textStyle={{ color: colors.textPrimary }}
              />
            </View>
          </ScrollView>
        );

      case 'success':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.centeredIconContainer}>
              {renderCheckIcon(colors.success)}
              <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                Booking Confirmed
              </Text>
            </View>

            {renderBookingInfo()}

            <Button
              title="Add to Calendar"
              variant="primary"
              size="small"
              onPress={onAddToCalendar}
              style={{ ...styles.smallButton, backgroundColor: colors.accent }}
            />
          </View>
        );

      case 'cancelConfirm':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.centeredIconContainer}>
              {renderCheckIcon(colors.success)}
              <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                Cancel Booking?
              </Text>
            </View>

            {renderBookingInfo()}

            <View style={styles.buttonContainer}>
              <Button
                title="Yes"
                variant="primary"
                size="small"
                onPress={handleCancelBooking}
                style={{
                  backgroundColor: colors.error,
                  flex: 1,
                  marginRight: 8,
                  height: 40,
                }}
                loading={loading}
              />

              <Button
                title="No"
                variant="outline"
                size="small"
                onPress={onClose}
                style={{
                  borderColor: colors.border,
                  flex: 1,
                  marginLeft: 8,
                  height: 40,
                }}
                textStyle={{ color: colors.textPrimary }}
              />
            </View>
          </View>
        );

      case 'cancelled':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.centeredIconContainer}>
              {renderCheckIcon(colors.success)}
              <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                Booking Cancelled
              </Text>
            </View>

            {renderBookingInfo()}
          </View>
        );

      default:
        return null;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={[styles.backdrop, { backgroundColor: colors.backdropOverlay }]}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: colors.bottomSheetBackground,
              maxHeight:
                status === 'cancelConfirm'
                  ? height * 0.35
                  : status === 'booking'
                    ? height * 0.4
                    : height * 0.3,
            },
          ]}>
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.bottomSheetHandle }]} />
          </View>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  contentContainer: {
    padding: 16,
    width: '100%',
  },
  centeredIconContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  smallButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 6,
    width: '100%',
  },
  smallOutlineButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 6,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  infoContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginTop: 4,
    borderWidth: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
});
