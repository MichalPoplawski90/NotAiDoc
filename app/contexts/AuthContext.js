import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

// Tworzenie kontekstu
const AuthContext = createContext(null);

// Provider kontekstu autoryzacji
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efekt sprawdzający, czy użytkownik jest zalogowany
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Błąd podczas ładowania danych użytkownika:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Funkcja logowania
  const login = async (email, password) => {
    // Mock implementacji logowania
    console.log('Logowanie:', email, password);
    
    // W prawdziwej implementacji tutaj byłoby wywołanie API
    const mockUser = {
      id: '1',
      email,
      fullName: 'Jan Kowalski',
    };

    // Zapisanie użytkownika w Secure Store
    await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  // Funkcja rejestracji
  const register = async (userData) => {
    // Mock implementacji rejestracji
    console.log('Rejestracja:', userData);
    
    // W prawdziwej implementacji tutaj byłoby wywołanie API
    const mockUser = {
      id: '1',
      email: userData.email,
      fullName: userData.fullName,
    };

    // Zapisanie użytkownika w Secure Store
    await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  // Funkcja wylogowania
  const logout = async () => {
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  const authContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook do użycia kontekstu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musi być używany wewnątrz AuthProvider');
  }
  return context;
}; 