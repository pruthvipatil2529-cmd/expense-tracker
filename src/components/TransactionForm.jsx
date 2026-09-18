// // src/components/TransactionForm.jsx
// import React from 'react';
// import { useTransaction } from '../context/TransactionContext'; // Use the hook

// const TransactionForm = () => {
//   // Destructure the necessary state and functions from the context
//   const { newTransaction, handleInputChange, handleAddTransaction, handleQuickAdd } = useTransaction();
//   return (
//     <section className="bg-white rounded-lg shadow-md p-4 mb-6">
//       <h2 className="text-xl font-semibold mb-3 text-gray-700">Quick Add</h2>
//       <div className="flex justify-around space-x-2 mb-4">
//         <button
//           onClick={() => handleQuickAdd(80, 'Lunch')}
//           className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex-1"
//         >
//           Lunch (₹80)
//         </button>
//         <button
//           onClick={() => handleQuickAdd(62, 'Bus Fare')}
//           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex-1"
//         >
//           Bus Fare (₹62)
//         </button>
//       </div>
//       <h2 className="text-xl font-semibold mb-3 text-gray-700">Add New Transaction</h2>
//       <form onSubmit={handleAddTransaction} className="space-y-4">
//         <input
//           type="number"
//           placeholder="Amount"
//           name="amount"
//           value={newTransaction.amount}
//           onChange={handleInputChange}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <input
//           type="text"
//           placeholder="Description"
//           name="description"
//           value={newTransaction.description}
//           onChange={handleInputChange}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <select
//           name="type"
//           value={newTransaction.type}
//           onChange={handleInputChange}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="expense">Expense</option>
//           <option value="income">Income</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//         >
//           Add Transaction
//         </button>
//       </form>
//     </section>
//   );
// };

// export default TransactionForm;


// // src/components/TransactionForm.jsx
// import React from 'react';
// import { useTransaction } from '../context/TransactionContext'; // Use the hook

// const TransactionForm = () => {
//   // Destructure the necessary state and functions from the context
//   const { newTransaction, handleInputChange, handleAddTransaction, handleQuickAdd } = useTransaction();
//   return (
//     <section className="bg-white rounded-lg shadow-md p-4 mb-6">
//       <h2 className="text-xl font-semibold mb-3 text-gray-700">Quick Add</h2>
//       <div className="flex justify-around space-x-2 mb-4">
//         <button
//           onClick={() => handleQuickAdd(-80, 'Lunch')}
//           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex-1"
//         >
//           Lunch (₹80)
//         </button>
//         <button
//           onClick={() => handleQuickAdd(-62, 'Bus Fare')}
//           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex-1"
//         >
//           Bus Fare (₹62)
//         </button>
//       </div>
//       <h2 className="text-xl font-semibold mb-3 text-gray-700">Add New Transaction</h2>
//       <form onSubmit={handleAddTransaction} className="space-y-4">
//         <input
//           type="number"
//           placeholder="Amount"
//           name="amount"
//           value={newTransaction.amount}
//           onChange={handleInputChange}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <input
//           type="text"
//           placeholder="Description"
//           name="description"
//           value={newTransaction.description}
//           onChange={handleInputChange}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <select
//           name="type"
//           value={newTransaction.type}
//           onChange={handleInputChange}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="expense">Expense</option>
//           <option value="income">Income</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//         >
//           Add Transaction
//         </button>
//       </form>
//     </section>
//   );
// };

// export default TransactionForm;




import React from 'react';
import { useTransaction } from '../context/TransactionContext';

const TransactionForm = () => {
  const { newTransaction, handleInputChange, handleAddTransaction, handleQuickAdd, categories, fetchCategories } = useTransaction();

  React.useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Quick Add</h2>
      <div className="flex justify-around space-x-2 mb-4">
        <button
          onClick={() => handleQuickAdd(-80, 'Lunch', 'Food', 'expense')}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex-1"
        >
          Lunch (₹80)
        </button>
        <button
          onClick={() => handleQuickAdd(-62, 'Bus Fare', 'Travel', 'expense')}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex-1"
        >
          Bus Fare (₹62)
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3 text-gray-700">Add New Transaction</h2>
      <form onSubmit={handleAddTransaction} className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={newTransaction.amount}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newTransaction.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="type"
          value={newTransaction.type}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        {/* New: Category dropdown */}
        <select
          name="category"
          value={newTransaction.category}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Other">Other</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Add Transaction
        </button>
      </form>
    </section>
  );
};

export default TransactionForm;
