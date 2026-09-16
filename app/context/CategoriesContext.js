import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]); // array of { id, name }
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/expenses/categories/');
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [isAuthenticated]);

  const addCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (categories.some((c) => c.name === trimmed)) return false;

    try {
      const response = await api.post('/expenses/categories/', { name: trimmed });
      setCategories((prev) => [...prev, response.data]);
      return true;
    } catch (error) {
      console.log('Error adding category:', error);
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/expenses/categories/${id}/`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.log('Error deleting category:', error);
    }
  };

  return (
    <CategoriesContext.Provider value={{ categories, isLoading, addCategory, deleteCategory }}>
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