import { client } from '../client';
import {
  IPaymentGatewayToken,
  IPaymentMethod,
  ISubscription,
  ISubscriptionCreateRequest,
  ISubscriptionCreateResponse,
} from '@/types/payment.interfaces';
import { IPlan } from '@/types/venues.interfaces';

// Define the response type structure
interface ApiResponse<T> {
  response: T;
  metadata: Record<string, any>;
}

export const PaymentAPI = {
  getPlans: async (): Promise<IPlan[]> => {
    const response = await client.get<ApiResponse<IPlan[]>>('/payment/plans');
    return response.response;
  },

  getSubscriptions: async (): Promise<ISubscription> => {
    const response = await client.get<ApiResponse<ISubscription>>('/payment/subscriptions/me');
    return response.response;
  },

  getSubscriptionQuery: async (): Promise<ISubscription | null> => {
    try {
      const response = await client.get<ApiResponse<ISubscription>>('/payment/subscriptions/me');
      return response.response;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  },

  getPaymentMethods: async (): Promise<IPaymentMethod[]> => {
    const response = await client.get<ApiResponse<IPaymentMethod[]>>('/payment/payment-methods/me');
    return response.response;
  },

  subscribe: async (
    subData: ISubscriptionCreateRequest,
  ): Promise<ISubscriptionCreateResponse[]> => {
    const response = await client.post<ApiResponse<ISubscriptionCreateResponse[]>>(
      '/payment/subscriptions',
      subData,
    );
    return response.response;
  },

  getClientToken: async (): Promise<IPaymentGatewayToken[]> => {
    const response =
      await client.get<ApiResponse<IPaymentGatewayToken[]>>('/payment/gateway/token');
    return response.response;
  },

  verifyPayment: async (paymentData: any) => {
    const response = await client.post<ApiResponse<any>>('/payment/payment-methods/me', {
      paymentMethodNonce: paymentData,
    });
    return response.response;
  },
};
