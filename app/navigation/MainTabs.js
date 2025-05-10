import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Ekrany
import CasesScreen from '../screens/cases/CasesScreen';
import DocumentsScreen from '../screens/documents/DocumentsScreen';
import StylesScreen from '../screens/styles/StylesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

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
        component={CasesScreen}
        options={{
          title: 'Sprawy',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          title: 'Dokumenty',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="description" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Styles"
        component={StylesScreen}
        options={{
          title: 'Style',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="style" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs; 