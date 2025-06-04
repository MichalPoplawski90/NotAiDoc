import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

// Ekrany
import DocumentsScreen from '../screens/documents/DocumentsScreen';

const Stack = createNativeStackNavigator();

const DocumentsStack = () => {
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
        name="DocumentsList"
        component={DocumentsScreen}
        options={{
          title: 'Dokumenty',
        }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsStack; 