import { createContext, useContext, useState } from 'react';

const CategoriesContext = createContext(null);

const initialCategories = ['Stock', 'Rent', 'Utilities', 'Transport', 'Salaries', 'Fuel', 'Other'];

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(initialCategories);

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return false;
    setCategories((prev) => [...prev, trimmed]);
    return true;
  };

  const deleteCategory = (name) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}