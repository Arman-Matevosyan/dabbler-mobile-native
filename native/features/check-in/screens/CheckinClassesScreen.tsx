import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme, Text } from '@design-system';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CheckinTabs } from './components';
import FreeClassesList from './components/FreeClassesList';
import ScheduledClassesList from './components/ScheduledClassesList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckInStackParamList } from '../CheckInNavigator';

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

type CheckInListScreenProps = NativeStackScreenProps<CheckInStackParamList, 'CheckInListScreen'>;

const CheckInListScreen = ({ route, navigation }: CheckInListScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'free' | 'scheduled'>('free');
  const { data, isLoading = false } = route.params;

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <HeaderBackButton onPress={handleGoBack} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('checkin.titles')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <CheckinTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        freeClassesCount={data?.freeClasses?.length || 0}
        scheduledClassesCount={data?.scheduledClasses?.length || 0}
      />

      <View style={styles.content}>
        {activeTab === 'free' ? (
          <FreeClassesList classes={data?.freeClasses || []} isLoading={isLoading} />
        ) : (
          <ScheduledClassesList classes={data?.scheduledClasses || []} isLoading={isLoading} />
        )}
      </View>
    </View>
  );
};

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
  content: {
    flex: 1,
  },
});

export default CheckInListScreen;
