// // src/components/TransactionList.jsx
// import React from 'react';
// import { useTransaction } from '../context/TransactionContext';

// // Accept an optional limit prop
// const TransactionList = ({ limit }) => {
//   const { transactions } = useTransaction();

//   // Slice the transactions array if a limit is provided
//   const transactionsToDisplay = limit ? transactions.slice(0, limit) : transactions;

//   return (
//     <section className="bg-white rounded-lg shadow-md p-4">
//       <h2 className="text-xl font-semibold mb-3 text-gray-700">
//         {limit ? 'Recent Transactions' : 'All Transactions'}
//       </h2>
//       {transactionsToDisplay.length > 0 ? (
//         <ul className="divide-y divide-gray-200">
//           {transactionsToDisplay.map((transaction) => (
//             <li key={transaction.id} className="py-3 flex justify-between items-center">
//               <div className="flex-1">
//                 <p className="text-gray-800 font-medium">
//                   {transaction.description}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(transaction.createdAt.seconds * 1000).toLocaleDateString()}
//                 </p>
//               </div>
//               <span
//                 className={`text-lg font-bold ${
//                   transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
//                 }`}
//               >
//                 {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount}
//               </span>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">No transactions added yet.</p>
//       )}
//     </section>
//   );
// };

// export default TransactionList;

// // src/components/TransactionList.jsx
// import React from "react";
// import { useTransaction } from "../context/TransactionContext";

// // Accept an optional limit prop
// const TransactionList = ({ limit }) => {
//   const { transactions } = useTransaction();

//   // Slice the transactions array if a limit is provided
//   const transactionsToDisplay = limit
//     ? transactions.slice(0, limit)
//     : transactions;

//   return (
//     <section className="bg-white rounded-lg shadow-md p-4">
//       <h2 className="text-xl font-semibold mb-3 text-gray-700">
//         {limit ? "Recent Transactions" : "All Transactions"}
//       </h2>
//       {transactionsToDisplay.length > 0 ? (
//         <ul className="divide-y divide-gray-200">
//           {transactionsToDisplay.map((transaction) => (
//             <li
//               key={transaction.id}
//               className="py-3 flex justify-between items-center"
//             >
//               <div className="flex-1">
//                 {/* <p className="text-gray-800 font-medium">{transaction.text}</p> */}
//                 <p className="text-sm text-gray-500">
//                   {new Date(
//                     transaction.createdAt.seconds * 1000
//                   ).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="flex-1">
//                  <span className={`text-sm font-bold  `}>
//                 {transaction.category}
//               </span>
//               </div>

//               <span
//                 className={`text-lg font-bold ${
//                   transaction.amount > 0 ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {transaction.amount > 0 ? "+" : "-"} ₹
//                 {Math.abs(transaction.amount)}
//               </span>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">No transactions added yet.</p>
//       )}
//     </section>
//   );
// };

// export default TransactionList;

import React from "react";
import { useTransaction } from "../context/TransactionContext";
import { FaTrashAlt } from "react-icons/fa";

const TransactionList = ({ limit }) => {
  const { transactions, deleteTransaction, filterType, setFilter } =
    useTransaction();

  // 1. Apply Filtering Logic based on filterType state
  const filteredTransactions = transactions.filter((t) => {
    // Only filter based on income/expense status if amount is present
    if (filterType === "income") return t.amount > 0;
    if (filterType === "expense") return t.amount < 0;
    return true; // 'all'
  });

  // 2. Apply Limit
  const transactionsToDisplay = limit
    ? filteredTransactions.slice(0, limit)
    : filteredTransactions;

  // Handle delete confirmation
  const handleDelete = (id, description) => {
    // We use window.confirm here for simplicity, but a professional app would use a custom modal
    if (
      window.confirm(
        `Are you sure you want to delete transaction: "${description}"?`
      )
    ) {
      deleteTransaction(id);
    }
  };

  // Helper for filter button styling
  const getButtonClass = (type) =>
    `px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
      filterType === type
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  return (
    <section className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">
        {limit ? "Recent Transactions" : "All Transactions"}
      </h2>

      {/* Filtering Buttons - Only visible on the full History page */}
      {!limit && (
        <div className="flex space-x-3 mb-4 border-b pb-3 border-gray-100">
          <button
            onClick={() => setFilter("all")}
            className={getButtonClass("all")}
          >
            All
          </button>
          <button
            onClick={() => setFilter("income")}
            className={getButtonClass("income")}
          >
            Income
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={getButtonClass("expense")}
          >
            Expense
          </button>
        </div>
      )}

      {transactionsToDisplay.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {transactionsToDisplay.map((transaction) => (
            <li
              key={transaction.id}
              className="py-3 flex justify-between items-center group hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="text-gray-800 font-medium">
                  {transaction.description} ({transaction.category})
                </p>
                <p className="text-sm text-gray-500">
                  {/* Safely display date */}
                  {transaction.createdAt?.seconds
                    ? new Date(
                        transaction.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`text-lg font-bold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : "-"} ₹
                  {Math.abs(transaction.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>

                {/* Delete Button - Hidden unless hovered */}
                <button
                  onClick={() =>
                    handleDelete(transaction.id, transaction.description)
                  }
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Transaction"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          {filterType === "all"
            ? "No transactions added yet."
            : `No ${filterType} transactions found.`}
        </p>
      )}
    </section>
  );
};

export default TransactionList;
