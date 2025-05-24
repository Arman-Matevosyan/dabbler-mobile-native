import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

interface ProfileActionsProps {
  colors: {
    accentPrimary: string;
    textPrimary: string;
    cardBackground: string;
  };
  translations?: {
    settings?: string;
    preferences?: string;
    language?: string;
    changeLanguage?: string;
    history?: string;
    checkinHistory?: string;
    support?: string;
    contactUs?: string;
    about?: string;
    version?: string;
    logout?: string;
  };
}

interface ActionItem {
  name: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  route: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ colors, translations }) => {
  const router = useNavigation();
  const { t } = useTranslation();

  const actions: ActionItem[] = [
    {
      name: 'favorites',
      icon: 'favorite',
      title: t('profile.favorites'),
      route: 'Favorites',
    },
    {
      name: 'checkin',
      icon: 'history',
      title: t('profile.checkins'),
      route: 'CheckinHistory',
    },
  ];

  const handleActionPress = (action: ActionItem) => {
    router.navigate(action.route as never);
  };

  return (
    <View style={{ marginTop: 16 }}>
      <View style={styles.actionsContainer}>
        {actions.map(action => (
          <TouchableOpacity
            onPress={() => handleActionPress(action)}
            key={action.name}
            activeOpacity={1}
            style={styles.actionItem}>
            <View style={styles.iconContainer}>
              <Icon
                name={action.icon}
                size={28}
                color={action.name === 'favorites' ? '#3B82F6' : '#3B82F6'}
                style={styles.actionIcon}
              />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 8,
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionIcon: {},
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginTop: 4,
  },
});

export default ProfileActions;
