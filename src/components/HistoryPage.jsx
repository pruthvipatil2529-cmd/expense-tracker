// src/components/HistoryPage.jsx
import React from 'react';
import TransactionList from './TransactionList';

const HistoryPage = () => {
  return (
 <div
      className="min-h-screen p-4 bg-gray-50 flex justify-center"
      style={{ height: '100vh', overflowY: 'auto' }}
    >
      <div className="w-full max-w-xl my-8">
        <div className="bg-white rounded-xl shadow-lg">
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;