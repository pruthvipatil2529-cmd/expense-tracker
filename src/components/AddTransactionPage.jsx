// src/components/AddTransactionPage.jsx
import React from 'react';
import TransactionForm from './TransactionForm';

const AddTransactionPage = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50 flex justify-center">
      <div className="w-full max-w-xl my-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">New Transaction</h2>
          <TransactionForm />
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;