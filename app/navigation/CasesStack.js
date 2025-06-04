import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

// Ekrany
import CasesScreen from '../screens/cases/CasesScreen';
import CreateCaseScreen from '../screens/cases/CreateCaseScreen';
import CaseDetailScreen from '../screens/cases/CaseDetailScreen';

const Stack = createNativeStackNavigator();

const CasesStack = () => {
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
        name="CasesList"
        component={CasesScreen}
        options={{
          title: 'Sprawy',
        }}
      />
      <Stack.Screen
        name="CreateCase"
        component={CreateCaseScreen}
        options={{
          title: 'Nowa sprawa',
          presentation: 'modal', // Wyświetla jako modal
        }}
      />
      <Stack.Screen
        name="CaseDetail"
        component={CaseDetailScreen}
        options={({ route }) => ({
          title: route.params?.caseData?.title || 'Szczegóły sprawy',
        })}
      />
    </Stack.Navigator>
  );
};

export default CasesStack; 