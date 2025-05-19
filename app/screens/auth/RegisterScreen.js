import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const theme = useTheme();

  const handleRegister = async () => {
    // Walidacja formularza
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Wszystkie pola są wymagane');
      return;
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    // Walidacja hasła - minimum 6 znaków (wymagane przez Supabase)
    if (password.length < 6) {
      setError('Hasło musi zawierać co najmniej 6 znaków');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register({
        fullName,
        email,
        password,
      });
      
      // Supabase domyślnie wymaga potwierdzenia email
      Alert.alert(
        "Rejestracja zakończona",
        "Sprawdź swoją skrzynkę email, aby potwierdzić rejestrację.",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      let errorMessage = 'Błąd podczas rejestracji. Spróbuj ponownie.';
      
      // Obsługa specyficznych błędów Supabase
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Użytkownik o tym adresie email już istnieje';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'Hasło nie spełnia wymagań bezpieczeństwa';
      } else if (error.message?.includes('Email')) {
        errorMessage = 'Podany adres email jest nieprawidłowy';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Utwórz konto</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          label="Imię i nazwisko"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Hasło"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Potwierdź hasło"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.registerButton}
        >
          Zarejestruj się
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          Masz już konto? Zaloguj się
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  formContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  loginButton: {
    marginTop: 16,
  },
  errorText: {
    color: '#B00020',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen; 