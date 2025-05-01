import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native';
import { useClassBook, useCancelBooking } from '../hooks/useBooking';
import { BookingStatusBottomSheet } from './BookingStatusBottomSheet';
import { useTheme } from '../theme/ThemeContext';
import { Button } from '../components/Button';
import type { BookingStatus } from './BookingStatusBottomSheet';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { ClassQueryKeys } from '@/constants/queryKeys';

interface ClassBookingWrapperProps {
  classId: string;
  venueId?: string | null;
  className?: string;
  classDescription?: string;
  date?: string;
  formattedDate?: string;
  venue?: string;
  instructor?: string;
  price?: string;
  duration?: string;
  cancellationPolicy?: string;
  isClassBooked: boolean;
  onBookingChange: () => void;
  onAddToCalendar?: () => void;
  onShare?: () => void;
}

export const ClassBookingWrapper: React.FC<ClassBookingWrapperProps> = ({
  classId,
  venueId,
  className,
  classDescription,
  date,
  formattedDate,
  venue,
  instructor,
  price,
  duration,
  cancellationPolicy,
  isClassBooked,
  onBookingChange,
  onAddToCalendar,
  onShare,
}) => {
  const { colors } = useTheme();
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('booking');
  const [isBookingStatusVisible, setIsBookingStatusVisible] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { confirmClassBooking } = useClassBook();
  const { cancelBookingMutation } = useCancelBooking();
  const queryClient = useQueryClient();

  // Handle initial booking flow
  const handleStartBooking = () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to book this class.');
      return;
    }

    setBookingStatus('booking');
    setIsBookingStatusVisible(true);
  };

  // Handle confirming the booking
  const handleConfirmBooking = async () => {
    if (!classId || !date) return;

    return new Promise((resolve, reject) => {
      confirmClassBooking.mutate(
        {
          classId,
          venueId,
          startDate: date,
        },
        {
          onSuccess: () => {
            setBookingStatus('success');
            onBookingChange();
            resolve(true);
          },
          onError: error => {
            console.error('Error booking class:', error);
            Alert.alert(
              'Booking Error',
              'There was an error booking this class. Please try again.',
            );
            reject(error);
          },
        },
      );
    });
  };

  // Start the cancellation flow
  const handleStartCancellation = () => {
    setBookingStatus('cancelConfirm');
    setIsBookingStatusVisible(true);
  };

  // Handle confirming the cancellation
  const handleConfirmCancellation = async () => {
    if (!classId || !date) return;

    return new Promise((resolve, reject) => {
      cancelBookingMutation.mutate(
        {
          classId,
          date,
        },
        {
          onSuccess: () => {
            setBookingStatus('cancelled');
            onBookingChange();
            resolve(true);
          },
          onError: error => {
            console.error('Error cancelling booking:', error);
            Alert.alert(
              'Cancellation Error',
              'There was an error cancelling your booking. Please try again.',
            );
            reject(error);
          },
        },
      );
    });
  };

  const handleCloseBottomSheet = () => {
    setIsBookingStatusVisible(false);
  };

  const invalidateQueries = () => {
    // Invalidate any queries that might be affected by booking changes
    queryClient.invalidateQueries({ queryKey: [ClassQueryKeys.schedules] });
    queryClient.invalidateQueries({ queryKey: [ClassQueryKeys.classDetails, classId] });
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        {isClassBooked ? (
          <Button
            title="Cancel Booking"
            variant="outline"
            size="medium"
            onPress={handleStartCancellation}
            disabled={cancelBookingMutation.isPending}
            style={{
              ...styles.actionButton,
              borderColor: '#E53E3E',
            }}
            textStyle={{ color: '#E53E3E' }}
            contentContainerStyle={styles.buttonContent}
            icon={
              cancelBookingMutation.isPending ? (
                <ActivityIndicator size="small" color="#E53E3E" />
              ) : undefined
            }
          />
        ) : (
          <Button
            title="Book Now"
            variant="primary"
            size="medium"
            onPress={handleStartBooking}
            disabled={confirmClassBooking.isPending}
            style={styles.actionButton}
            contentContainerStyle={styles.buttonContent}
            icon={
              confirmClassBooking.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : undefined
            }
          />
        )}
      </View>

      <BookingStatusBottomSheet
        isVisible={isBookingStatusVisible}
        onClose={handleCloseBottomSheet}
        onBookConfirm={handleConfirmBooking}
        onCancelConfirm={handleConfirmCancellation}
        onAddToCalendar={onAddToCalendar}
        onShare={onShare}
        status={bookingStatus}
        className={className}
        classDescription={classDescription}
        dateTime={formattedDate}
        venue={venue}
        instructor={instructor}
        price={price}
        duration={duration}
        cancellationPolicy={cancellationPolicy}
        invalidateQueries={invalidateQueries}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 20,
  },
  actionButton: {
    minWidth: 100,
    borderRadius: 4,
  },
  buttonContent: {
    paddingHorizontal: 12,
  },
});
