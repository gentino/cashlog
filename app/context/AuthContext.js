import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken , setUnauthorizedHandler} from '../services/api';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while checking for a saved token on startup


  useEffect(() => {
  setUnauthorizedHandler(() => {
    AsyncStorage.removeItem('authToken');
    setAuthToken(null);
    setToken(null);
  });
}, []);

  // On app startup, check if a token was saved from a previous session
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }
      } catch (e) {
        console.log('Error loading saved token:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const register = async ({ businessName, emailOrPhone, password }) => {
    const response = await api.post('/auth/register/', {
      business_name: businessName,
      email_or_phone: emailOrPhone,
      password,
    });
    const newToken = response.data.token;
    await AsyncStorage.setItem('authToken', newToken);
    setAuthToken(newToken);
    setToken(newToken);
  };

  const login = async ({ emailOrPhone, password }) => {
    const response = await api.post('/auth/login/', {
      email_or_phone: emailOrPhone,
      password,
    });
    const newToken = response.data.token;
    await AsyncStorage.setItem('authToken', newToken);
    setAuthToken(newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setAuthToken(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, isAuthenticated: !!token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}