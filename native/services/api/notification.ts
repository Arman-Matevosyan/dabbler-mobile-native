import {client} from '../client';

export const NotificationApi = {
  registerDevice: async (token: string, deviceId: string) => {
    await client.post(
      '/notifications/push/user-configs/me',
      {
        deviceToken: token,
        deviceId: deviceId,
      },
      {withAuth: true},
    );
  },
};
