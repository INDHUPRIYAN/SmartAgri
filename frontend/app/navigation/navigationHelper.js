import { pushToStack } from './NavigationStack';
import { useNavigation } from '@react-navigation/native';

export const useNavigateWithStack = () => {
  const navigation = useNavigation();

  const navigateTo = (route) => {
    pushToStack(route);
    navigation.navigate(route);
  };

  return { navigateTo };
};
