import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme, Text} from '@design-system';
import {useTranslation} from 'react-i18next';

interface CheckinTabsProps {
  activeTab: 'free' | 'scheduled';
  onChangeTab: (tab: 'free' | 'scheduled') => void;
  freeClassesCount: number;
  scheduledClassesCount: number;
}

const CheckinTabs = ({
  activeTab,
  onChangeTab,
  freeClassesCount,
  scheduledClassesCount,
}: CheckinTabsProps) => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'free' && [
              styles.activeTab,
              {borderBottomColor: colors.accent},
            ],
          ]}
          onPress={() => onChangeTab('free')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'free'
                    ? colors.textPrimary
                    : colors.textSecondary,
              },
            ]}>
            {t('checkin.freeClasses')}
          </Text>
          <View style={styles.countContainer}>
            <Text
              style={[
                styles.countText,
                {
                  color:
                    activeTab === 'free' ? colors.accent : colors.textSecondary,
                },
              ]}>
              {freeClassesCount}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'scheduled' && [
              styles.activeTab,
              {borderBottomColor: colors.accent},
            ],
          ]}
          onPress={() => onChangeTab('scheduled')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'scheduled'
                    ? colors.textPrimary
                    : colors.textSecondary,
              },
            ]}>
            {t('checkin.scheduledClasses')}
          </Text>
          <View style={styles.countContainer}>
            <Text
              style={[
                styles.countText,
                {
                  color:
                    activeTab === 'scheduled'
                      ? colors.accent
                      : colors.textSecondary,
                },
              ]}>
              {scheduledClassesCount}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  countContainer: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CheckinTabs;
