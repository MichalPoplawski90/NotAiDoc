import React, { createContext, useState, useContext, useEffect } from 'react';

// Tworzenie kontekstu
const AuthContext = createContext(null);

// Provider kontekstu autoryzacji
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  // Mock funkcja logowania
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user
      const mockUser = {
        id: '1',
        email: email,
        full_name: 'Test User'
      };
      
      setUser(mockUser);
      setSession({ user: mockUser });
      return mockUser;
    } catch (error) {
      console.error('Błąd logowania:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock funkcja rejestracji
  const register = async (userData) => {
    setLoading(true);
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user
      const mockUser = {
        id: '2',
        email: userData.email,
        full_name: userData.fullName
      };
      
      setUser(mockUser);
      setSession({ user: mockUser });
      return mockUser;
    } catch (error) {
      console.error('Błąd rejestracji:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock funkcja wylogowania
  const logout = async () => {
    try {
      setUser(null);
      setSession(null);
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