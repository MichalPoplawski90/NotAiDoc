import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Stack navigators
import CasesStack from './CasesStack';
import DocumentsStack from './DocumentsStack';
import StylesStack from './StylesStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Cases"
        component={CasesStack}
        options={{
          title: 'Sprawy',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsStack}
        options={{
          title: 'Dokumenty',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="description" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Styles"
        component={StylesStack}
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="style" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs; 