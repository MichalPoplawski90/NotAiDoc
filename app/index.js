// Testowanie zmiennych środowiskowych
import envTest from './utils/envTest';
console.log('Env test:', envTest);

import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Konteksty
import { AuthProvider } from './contexts/AuthContext';

// Ekrany
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import MainTabs from './navigation/MainTabs';
import ScanDocumentScreen from './screens/documents/ScanDocumentScreen';
import DocumentDetailsScreen from './screens/documents/DocumentDetailsScreen';
import EditDocumentDescriptionScreen from './screens/documents/EditDocumentDescriptionScreen';
import StyleLearningScreen from './screens/styles/StyleLearningScreen';

// Theme
import { theme } from './styles/theme';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              {/* Ekrany autoryzacji */}
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Rejestracja' }} />
              
              {/* Główna nawigacja */}
              <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
              
              {/* Ekrany dokumentów */}
              <Stack.Screen name="ScanDocument" component={ScanDocumentScreen} options={{ title: 'Skanuj dokument' }} />
              <Stack.Screen name="DocumentDetails" component={DocumentDetailsScreen} options={{ title: 'Szczegóły dokumentu' }} />
              <Stack.Screen name="EditDocumentDescription" component={EditDocumentDescriptionScreen} options={{ title: 'Edytuj opis' }} />
              
              {/* Ekrany stylów */}
              <Stack.Screen name="StyleLearning" component={StyleLearningScreen} options={{ title: 'Uczenie się stylu' }} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default registerRootComponent(App); 