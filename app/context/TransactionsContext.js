import { createContext, useContext, useState } from 'react';

const TransactionsContext = createContext(null);

// Sample seed data so screens aren't empty on first load
const initialTransactions = [
  {
    id: '1',
    type: 'sale',
    description: 'Hair Treatment',
    amount: 15000,
    paymentMethod: 'Transfer',
    category: null,
    note: '',
    date: new Date().toISOString(),
  },
];

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(), // simple unique id for now
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Derived values other screens will want
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

  const value = {
    transactions,
    todaysTransactions,
    totalSales,
    totalExpenses,
    estimatedNet: totalSales - totalExpenses,
    addTransaction,
    deleteTransaction,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

// Custom hook so screens just call useTransactions() instead of importing useContext + TransactionsContext every time
export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}