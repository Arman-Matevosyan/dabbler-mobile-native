import { Avatar, Text } from '@/design-system';
import { IUserProfile } from '@/types/user.interfaces';
import React from 'react';
import { View } from 'react-native';

interface UserInfoCardProps {
  user: IUserProfile;
  handleAvatarUpload: () => Promise<void>;
  isAvatarUploadLoading: boolean;
  title?: string;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  handleAvatarUpload,
  isAvatarUploadLoading,
  title,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 16,
      }}>
      <Avatar
        imageUri={user?.image}
        size={120}
        onPress={handleAvatarUpload}
        isUploading={isAvatarUploadLoading}
      />

      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'center',
          marginTop: 16,
        }}>
        {user?.firstName || ''} {user?.lastName || ''}
      </Text>
    </View>
  );
};

export default UserInfoCard;
