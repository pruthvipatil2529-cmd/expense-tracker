// src/context/TransactionContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const TransactionContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useTransaction() {
  return useContext(TransactionContext);
}

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${type === 'success'
      ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400'
      : 'bg-rose-950/90 border-rose-500/50 text-rose-400'
      } backdrop-blur-xl`}
  >
    {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
    <span className="font-bold text-sm tracking-tight">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-white/10 p-1 rounded-lg">
      <X size={16} />
    </button>
  </motion.div>
);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Re-added loading
  const { currentUser } = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    type: "Expense",
    category: "Other",
    date: new Date().toISOString().split('T')[0],
  });

  const [serverError, setServerError] = useState(false);

  const fetchTransactions = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_URL}/api/transactions?userId=${currentUser.id}`);
      const data = await response.json();
      if (response.ok) {
        setTransactions(Array.isArray(data) ? data : []);
        setServerError(false);
      } else {
        setServerError(true);
      }
    } catch (error) {
      setServerError(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchTransactions, 15000); // Background refresh
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    const safeTx = Array.isArray(transactions) ? transactions : [];
    const totalIncome = safeTx.filter((t) => t.type === 'Income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalExpense = safeTx.filter((t) => t.type === 'Expense').reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);
    setIncome(totalIncome);
    setExpense(totalExpense);
    setBalance(totalIncome - totalExpense);
  }, [transactions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = async (e) => {
    if (e) e.preventDefault();

    if (!currentUser || !newTransaction.amount || !newTransaction.description) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, ...newTransaction })
      });

      if (response.ok) {
        fetchTransactions();
        showToast("Transaction Successfully Added!", "success");
        setNewTransaction({
          amount: "",
          description: "",
          type: "Expense",
          category: "Other",
          date: new Date().toISOString().split('T')[0],
        });
      } else {
        showToast("Transaction Not Added!", "error");
      }
    } catch (error) {
      showToast("Connection failure", "error");
    }
  };

  const deleteTransaction = async (id) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_URL}/api/transactions/${id}?userId=${currentUser.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTransactions();
        showToast("Transaction Deleted", "success");
      }
    } catch (error) {
      showToast("Action failed", "error");
    }
  };

  const value = {
    balance, income, expense, transactions,
    categories, fetchCategories,
    newTransaction, handleInputChange,
    handleAddTransaction, deleteTransaction,
    serverError, loading
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </TransactionContext.Provider>
  );
}
