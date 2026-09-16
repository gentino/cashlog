import { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';
import { getErrorMessage } from '../utils/getErrorMessage';

const TransactionsContext = createContext(null);
const CACHE_KEY = 'cachedTransactions';

const mapSale = (s) => ({
  id: `sale-${s.id}`,
  rawId: s.id,
  type: 'sale',
  description: s.description,
  amount: parseFloat(s.amount),
  paymentMethod: s.payment_method,
  category: null,
  categoryId: null,
  note: s.note,
  date: s.date,
  pendingSync: false,
});

const mapExpense = (e) => ({
  id: `expense-${e.id}`,
  rawId: e.id,
  type: 'expense',
  description: e.description,
  amount: parseFloat(e.amount),
  paymentMethod: e.payment_method,
  category: e.category_name,
  categoryId: e.category,
  note: e.note,
  date: e.date,
  pendingSync: false,
});

export function TransactionsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useNetwork();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevConnected = useRef(isConnected);

  // Persist every change to disk, so pending/offline items survive an app restart
  useEffect(() => {
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(transactions)).catch(() => {});
  }, [transactions]);

  // On login: load cache instantly, then refresh from server if online
  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) {
        setTransactions([]);
        return;
      }
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) setTransactions(JSON.parse(cached));
      } catch (e) {
        console.log('Error loading cached transactions:', e);
      }
      if (isConnected) {
        fetchTransactions();
      }
    };
    init();
  }, [isAuthenticated]);

  // When connectivity is restored, sync pending items then refresh from server
  useEffect(() => {
    if (!prevConnected.current && isConnected && isAuthenticated) {
      syncPendingTransactions().then(fetchTransactions);
    }
    prevConnected.current = isConnected;
  }, [isConnected]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [salesRes, expensesRes] = await Promise.all([
        api.get('/sales/'),
        api.get('/expenses/'),
      ]);
      const sales = salesRes.data.map(mapSale);
      const expenses = expensesRes.data.map(mapExpense);
      const fresh = [...sales, ...expenses];

      // Keep any not-yet-synced local items - don't let a server refresh wipe them out
      setTransactions((prev) => {
        const stillPending = prev.filter((t) => t.pendingSync);
        return [...stillPending, ...fresh].sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const syncSingleTransaction = async (localTransaction) => {
    let response;
    if (localTransaction.type === 'sale') {
      response = await api.post('/sales/', {
        description: localTransaction.description,
        amount: localTransaction.amount,
        payment_method: localTransaction.paymentMethod,
        note: localTransaction.note,
        date: localTransaction.date,
      });
    } else {
      response = await api.post('/expenses/', {
        description: localTransaction.description,
        amount: localTransaction.amount,
        payment_method: localTransaction.paymentMethod,
        category: localTransaction.categoryId,
        note: localTransaction.note,
        date: localTransaction.date,
      });
    }
    const mapped = localTransaction.type === 'sale' ? mapSale(response.data) : mapExpense(response.data);
    setTransactions((prev) => prev.map((t) => (t.id === localTransaction.id ? mapped : t)));
  };

  const syncPendingTransactions = async () => {
    const pending = transactions.filter((t) => t.pendingSync);
    for (const t of pending) {
      try {
        await syncSingleTransaction(t);
      } catch (err) {
        console.log('Sync failed for', t.id, '- will retry next time');
        // Leave it marked pendingSync - next reconnect will retry automatically
      }
    }
  };

  // transaction: { type, amount, description, paymentMethod, note, category (id, expenses only), categoryName (expenses only) }
  const addTransaction = async (transaction) => {
    const nowIso = new Date().toISOString();
    const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const localTransaction = {
      id: tempId,
      rawId: null,
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      category: transaction.categoryName || null,
      categoryId: transaction.category || null,
      note: transaction.note,
      date: nowIso,
      pendingSync: true,
    };

    // Always succeeds instantly, online or offline
    setTransactions((prev) => [localTransaction, ...prev]);

    if (isConnected) {
      try {
        await syncSingleTransaction(localTransaction);
      } catch (err) {
        // Stays pending - will retry automatically once back online
      }
    }
  };

  const updateTransaction = async (existingTransaction, updates) => {
    if (existingTransaction.pendingSync) {
      // Never reached the server yet - just update the local pending copy directly
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === existingTransaction.id
            ? {
                ...t,
                description: updates.description,
                amount: updates.amount,
                paymentMethod: updates.paymentMethod,
                note: updates.note,
                category: updates.categoryName ?? t.category,
                categoryId: updates.category ?? t.categoryId,
              }
            : t
        )
      );
      return;
    }

    // Already synced - requires a real connection to update the server record
    const endpoint = existingTransaction.type === 'sale' ? 'sales' : 'expenses';
    const payload = {
      description: updates.description,
      amount: updates.amount,
      payment_method: updates.paymentMethod,
      note: updates.note,
      date: existingTransaction.date,
    };
    if (existingTransaction.type === 'expense') {
      payload.category = updates.category;
    }

    const response = await api.patch(`/${endpoint}/${existingTransaction.rawId}/`, payload);
    const mapped = existingTransaction.type === 'sale' ? mapSale(response.data) : mapExpense(response.data);
    setTransactions((prev) => prev.map((t) => (t.id === existingTransaction.id ? mapped : t)));
  };

  const deleteTransaction = async (transaction) => {
    if (transaction.pendingSync) {
      // Never reached the server - just remove locally, no API call needed
      setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
      return;
    }
    const endpoint = transaction.type === 'sale' ? 'sales' : 'expenses';
    await api.delete(`/${endpoint}/${transaction.rawId}/`);
    setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
  };

  const todaysTransactions = transactions.filter((t) => {
    const today = new Date().toDateString();
    return new Date(t.date).toDateString() === today;
  });

  const totalSales = todaysTransactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = todaysTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = transactions.filter((t) => t.pendingSync).length;

  const value = {
    transactions,
    isLoading,
    error,
    pendingCount,
    todaysTransactions,
    totalSales,
    totalExpenses,
    estimatedNet: totalSales - totalExpenses,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetchTransactions: fetchTransactions,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}