import { createContext, useContext, useState } from 'react';
const defaultAvatar = require('../assets/image/profile.png');
const BusinessContext = createContext(null);

const initialBusiness = {
  name: 'Mox Corp',
  phone: '+234 8131338819 ',
  photoUrl: defaultAvatar,
  currency: 'NGN',
  currencySymbol: '₦',
};

const CURRENCY_OPTIONS = [
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
];

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(initialBusiness);

  const updateBusiness = (updates) => {
    setBusiness((prev) => ({ ...prev, ...updates }));
  };

  const setCurrency = (code) => {
    const match = CURRENCY_OPTIONS.find((c) => c.code === code);
    if (match) {
      updateBusiness({ currency: match.code, currencySymbol: match.symbol });
    }
  };

  return (
    <BusinessContext.Provider
      value={{ business, updateBusiness, setCurrency, currencyOptions: CURRENCY_OPTIONS }}
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