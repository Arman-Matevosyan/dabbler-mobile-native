import React from 'react';
import { FlatList, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme, Text } from '@design-system';
import { useTranslation } from 'react-i18next';
import { ClassListSkeleton } from '@/components/classes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import ClassListEmptyState from './ClassListEmptyState';

interface Class {
  id: string;
  name: string;
  instructorInfo: string;
  duration: number;
  scheduled: boolean;
  date: string | null;
  scheduledSpots: number;
  totalSpots: number;
  covers: Array<{ url: string }>;
  venue: { name: string };
  categories: string[];
}

interface ScheduledClassesListProps {
  classes: Class[];
  isLoading?: boolean;
}

const ScheduledClassesList = ({ classes, isLoading = false }: ScheduledClassesListProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const navigateToClassDetails = (classItem: Class) => {
    console.log('Navigate to class details:', classItem.id, classItem.date);
  };

  const renderClassItem = ({ item }: { item: Class }) => {
    const coverImage =
      item.covers && item.covers.length > 0
        ? item.covers[0]?.url
        : `https://picsum.photos/400/200?random=${item.id}`;

    let formattedDate = '';
    let formattedTime = '';

    if (item.date) {
      try {
        const date = parseISO(item.date);
        formattedDate = format(date, 'EEE, MMM d');
        formattedTime = format(date, 'HH:mm');
      } catch (error) {
        console.error('Date parsing error:', error);
      }
    }

    const isNoShow = Math.random() < 0.3;

    return (
      <TouchableOpacity
        style={[styles.classCard, { backgroundColor: colors.background }]}
        onPress={() => navigateToClassDetails(item)}
        activeOpacity={0.7}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: coverImage }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={[styles.className, { color: colors.textPrimary }]}>{item.name}</Text>

          {formattedDate && formattedTime && (
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.icon}
              />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {formattedDate} - {formattedTime}
              </Text>
            </View>
          )}

          {item.venue && item.venue.name && (
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.icon}
              />
              <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.venue.name}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={16}
              color={colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {item.instructorInfo}
            </Text>
          </View>

          {isNoShow && (
            <View style={styles.noShowContainer}>
              <View style={[styles.noShowIndicator, { backgroundColor: '#FF6B6B' }]} />
              <Text style={[styles.noShowText, { color: '#FF6B6B' }]}>{t('checkin.noShow')}</Text>
            </View>
          )}
        </View>

        <View style={styles.arrowContainer}>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <ClassListSkeleton count={4} />;
  }

  if (classes.length === 0) {
    return <ClassListEmptyState type="scheduled" />;
  }

  return (
    <FlatList
      data={classes}
      renderItem={renderClassItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
  },
  classCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: 90,
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  noShowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  noShowIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  noShowText: {
    fontSize: 13,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
});

export default ScheduledClassesList;
