import { client } from '../client';
import { IUserProfile } from '@/types/user.interfaces';

export const UserAPI = {
  getCurrentUser: async (): Promise<IUserProfile> => {
    try {
      return await client.get('/users/me', { withAuth: true });
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  verifyEmail: async (): Promise<void> => {
    await client.post('/user/verify-email');
  },

  uploadAvatar: async (formData: FormData): Promise<any> => {
    try {
      const response = await client.post('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};
