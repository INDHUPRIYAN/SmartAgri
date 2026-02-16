import { BackHandler } from 'react-native';
import { useEffect } from 'react';
import { popFromStack } from '../navigation/NavigationStack';
import { useNavigation } from '@react-navigation/native';

export const useCustomBackHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      const previousScreen = popFromStack();
      if (previousScreen) {
        navigation.navigate(previousScreen);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);
};
