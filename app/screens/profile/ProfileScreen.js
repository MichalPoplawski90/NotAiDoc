import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Divider, List, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar.Text 
          size={80} 
          label={user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'} 
          backgroundColor={theme.colors.primary}
        />
        <Text style={styles.userName}>{user?.fullName || 'Użytkownik'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
      </View>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Ustawienia konta</Text>
          
          <List.Item
            title="Edytuj profil"
            left={props => <List.Icon {...props} icon="account-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Edytuj profil')}
          />
          
          <Divider />
          
          <List.Item
            title="Zmień hasło"
            left={props => <List.Icon {...props} icon="lock" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Zmień hasło')}
          />
          
          <Divider />
          
          <List.Item
            title="Ustawienia powiadomień"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Ustawienia powiadomień')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Ustawienia aplikacji</Text>
          
          <List.Item
            title="Konfiguracja synchronizacji"
            left={props => <List.Icon {...props} icon="sync" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Konfiguracja synchronizacji')}
          />
          
          <Divider />
          
          <List.Item
            title="Zarządzaj szablonami"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Zarządzaj szablonami')}
          />
          
          <Divider />
          
          <List.Item
            title="Ustawienia OCR"
            left={props => <List.Icon {...props} icon="text-recognition" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Ustawienia OCR')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>O aplikacji</Text>
          
          <List.Item
            title="Wersja aplikacji"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          
          <Divider />
          
          <List.Item
            title="Pomoc i wsparcie"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Pomoc i wsparcie')}
          />
          
          <Divider />
          
          <List.Item
            title="Polityka prywatności"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Polityka prywatności')}
          />
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        Wyloguj się
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  settingsCard: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 32,
  },
});

export default ProfileScreen; 