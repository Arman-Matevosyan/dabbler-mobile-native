import { useCheckIn } from '../hooks/useCheckin';
import CheckinClassesScreen from './CheckinClassesScreen';
import { useRoute } from '@react-navigation/native';
import { CheckInStackParamList } from '../CheckInNavigator';
import { RouteProp } from '@react-navigation/native';

export default function CheckinClassesRoute() {
  const { checkInData, isLoading } = useCheckIn();
  return (
    <CheckinClassesScreen
      route={{
        params: {
          data: checkInData,
          isLoading: isLoading,
        },
        key: '',
        name: 'CheckInListScreen',
      }}
      navigation={{} as any}
    />
  );
}
