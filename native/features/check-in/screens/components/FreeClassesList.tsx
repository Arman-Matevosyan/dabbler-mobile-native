import React from 'react';
import { FlatList, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme, Text } from '@design-system';
import { useTranslation } from 'react-i18next';
import { ClassListSkeleton } from '@/components/classes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
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

interface FreeClassesListProps {
  classes: Class[];
  isLoading?: boolean;
}

const FreeClassesList = ({ classes, isLoading = false }: FreeClassesListProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const navigateToClassDetails = (classItem: Class) => {
    console.log('Navigate to class details:', classItem.id);
  };

  const renderClassItem = ({ item }: { item: Class }) => {
    const coverImage =
      item.covers && item.covers.length > 0
        ? item.covers[0]?.url
        : `https://picsum.photos/400/200?random=${item.id}`;

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

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {item.duration} {t('classes.minutes')}
            </Text>
          </View>

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

          <View style={styles.tagsContainer}>
            {item.categories &&
              item.categories.slice(0, 2).map((category, index) => (
                <View
                  key={index}
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor: colors.card,
                    },
                  ]}>
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                    {typeof category === 'string' ? category : t('classes.category')}
                  </Text>
                </View>
              ))}
          </View>
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
    return <ClassListEmptyState type="free" />;
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
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
});

export default FreeClassesList;
