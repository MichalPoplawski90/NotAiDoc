import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Bardzo prosty adapter localStorage dla AsyncStorage
const asyncStorageAdapter = {
  getItem: async (key) => {
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
  }
};

// Utworzenie klienta Supabase (wersja 1.x)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  localStorage: asyncStorageAdapter
});

export default supabase; 