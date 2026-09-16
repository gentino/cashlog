import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { Platform } from 'react-native';

const BusinessContext = createContext(null);

const CURRENCY_OPTIONS = [
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
];

const fallbackBusiness = {
  name: '',
  phone: '',
  photoUrl: null,
  currency: 'NGN',
  currencySymbol: '₦',
};

export function BusinessProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [business, setBusiness] = useState(fallbackBusiness);
  const [isLoading, setIsLoading] = useState(false);

  const mapApiToBusiness = (data) => ({
    name: data.name,
    phone: data.phone,
    photoUrl: data.photo, // full URL returned by Django's ImageField
    currency: data.currency,
    currencySymbol: data.currency_symbol,
  });

  const fetchBusiness = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/businesses/me/');
      setBusiness(mapApiToBusiness(response.data));
    } catch (error) {
      console.log('Error fetching business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch business data whenever the user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBusiness();
    } else {
      setBusiness(fallbackBusiness);
    }
  }, [isAuthenticated]);

 const updateBusiness = async (updates) => {
  const formData = new FormData();

  if (updates.name !== undefined) formData.append('name', updates.name);
  if (updates.currency !== undefined) formData.append('currency', updates.currency);

  if (updates.photoFile) {
    if (Platform.OS === 'web') {
      // On web, expo-image-picker returns a blob: URI - we need to fetch it
      // and convert it into an actual Blob object for FormData to accept.
      const response = await fetch(updates.photoFile.uri);
      const blob = await response.blob();
      formData.append('photo', blob, 'business_photo.jpg');
    } else {
      // On native (iOS/Android), this special object shape is required instead.
      formData.append('photo', {
        uri: updates.photoFile.uri,
        name: 'business_photo.jpg',
        type: 'image/jpeg',
      });
    }
  }

  const response = await api.patch('/businesses/me/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  setBusiness(mapApiToBusiness(response.data));
};


  const setCurrency = async (code) => {
    await updateBusiness({ currency: code });
  };

  return (
    <BusinessContext.Provider
      value={{ business, isLoading, updateBusiness, setCurrency, currencyOptions: CURRENCY_OPTIONS, refetchBusiness: fetchBusiness }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}