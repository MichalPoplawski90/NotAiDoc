import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

// Ekrany
import StylesScreen from '../screens/styles/StylesScreen';

const Stack = createNativeStackNavigator();

const StylesStack = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="StylesList"
        component={StylesScreen}
        options={{
          title: 'Style',
        }}
      />
    </Stack.Navigator>
  );
};

export default StylesStack; 