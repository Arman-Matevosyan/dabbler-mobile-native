import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {IDiscoverClass} from '@/types/class.interfaces';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type VenuesStackParamList = {
  VenuesList: undefined;
  VenueDetails: {
    id: string;
  };
  VenueClassesList: {
    id: string;
  };
};

export type ClassesStackParamList = {
  ClassesList: undefined;
  ClassDetails: {
    id: string;
    date?: string;
  };
  ClassScreen: undefined;
};

export type CheckInStackParamList = {
  CheckIn: undefined;
  CheckInListScreen: {
    data: {
      freeClasses: IDiscoverClass[];
      scheduledClasses: IDiscoverClass[];
    };
    isLoading?: boolean;
  };
  CheckInClasses: {
    data: {
      freeClasses: IDiscoverClass[];
      scheduledClasses: IDiscoverClass[];
    };
    isLoading: boolean;
  };
};

export type ProfileStackParamList = {
  AuthUser: undefined;
  UnAuth: undefined;
  Settings: undefined;
  ProfileDetails: undefined;
  Display: undefined;
  Language: undefined;
  Favorites: undefined;
  CheckinHistory: undefined;
  Membership: undefined;
  Payment: undefined;
  Plans: undefined;
};

export type PaymentStackParamList = {
  ProcessPayment: {
    plan: string;
  };
  PaymentResult: {
    status?: 'success' | 'failed';
    plan: string;
    message?: string;
    nonce?: string;
  };
};

export type RootStackParamList = {
  MainTabs: {
    screen?: string;
    params?: any;
  };
  Auth: {
    screen?: keyof AuthStackParamList;
  };
  PaymentScreens: {
    screen?: keyof PaymentStackParamList;
    params?: any;
  };
};

export type TabNavigatorParamList = {
  Venues: undefined;
  Classes: undefined;
  CheckIn: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
export type VenuesStackNavigationProp =
  NativeStackNavigationProp<VenuesStackParamList>;
export type ClassesStackNavigationProp =
  NativeStackNavigationProp<ClassesStackParamList>;
export type CheckInStackNavigationProp =
  StackNavigationProp<CheckInStackParamList>;
export type ProfileStackNavigationProp =
  StackNavigationProp<ProfileStackParamList>;
export type PaymentStackNavigationProp =
  NativeStackNavigationProp<PaymentStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabNavigatorParamList>;

export type PaymentResultRouteProp = RouteProp<
  PaymentStackParamList,
  'PaymentResult'
>;
