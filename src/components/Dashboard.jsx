// src/components/Dashboard.jsx
import React from 'react';
import Header from './Header';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column for the form and Quick Add buttons */}
          <div className="md:col-span-1">
            <TransactionForm />
          </div>

          {/* Right Column for the transaction list */}
          <div className="md:col-span-1">
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;