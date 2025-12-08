import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface Transaction {
  id: string;
  date: string;
  item: string;
  amount: number;
  category: 'income' | 'expense';
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id'>) => void; // 追加
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [
      { id: '1', date: '2025-12-01', item: '給料', amount: 300000, category: 'income' },
      { id: '2', date: '2025-12-02', item: '家賃', amount: -80000, category: 'expense' },
      { id: '3', date: '2025-12-03', item: '食費', amount: -5000, category: 'expense' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prevTransactions) => [...prevTransactions, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prevTransactions) => prevTransactions.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    );
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};
