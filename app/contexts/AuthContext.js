import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import supabase from '../utils/supabase';

// Tworzenie kontekstu
const AuthContext = createContext(null);

// Provider kontekstu autoryzacji
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Efekt sprawdzający, czy użytkownik jest zalogowany
  useEffect(() => {
    // Sprawdzenie istniejącej sesji
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user || null);
    setLoading(false);

    // Nasłuchiwanie zmian sesji
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // Funkcja logowania
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { error, user } = await supabase.auth.signIn({
        email,
        password,
      });
      
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Błąd logowania:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Funkcja rejestracji
  const register = async (userData) => {
    setLoading(true);
    try {
      const { error, user } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        data: {
          full_name: userData.fullName,
        },
      });
      
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Błąd rejestracji:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Funkcja wylogowania
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Błąd podczas wylogowania:', error.message);
    }
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