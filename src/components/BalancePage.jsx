// // // src/components/BalancePage.jsx
// // import React from 'react';
// // import Header from './Header';
// // import TransactionList from './TransactionList';
// // import { Link } from 'react-router-dom';
// // import { useTransaction } from '../context/TransactionContext';

// // const BalancePage = () => {
// //   const { balance } = useTransaction();

// //   return (
// //     <div className="flex flex-col min-h-screen bg-gray-50">
// //       <main className="flex-grow p-4 md:p-8">
// //         <div className="max-w-3xl mx-auto flex flex-col gap-6">

// //           {/* Balance Card */}
// //           <div className="bg-white rounded-xl shadow-lg p-6 text-center">
// //             <h1 className="text-xl font-bold text-gray-800">Current Balance</h1>
// //             <p 
// //               className="text-6xl font-extrabold mt-2 tracking-tight"
// //               style={{ color: balance >= 0 ? '#10B981' : '#EF4444' }}
// //             >
// //               ₹{balance.toLocaleString('en-IN')}
// //             </p>
// //           </div>

// //           {/* Quick Actions Card */}
// //           <div className="bg-white rounded-xl shadow-lg p-6">
// //             <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
// //             <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
// //               <Link
// //                 to="/add"
// //                 className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
// //               >
// //                 Add Transaction
// //               </Link>
// //               <Link
// //                 to="/history"
// //                 className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
// //               >
// //                 View History
// //               </Link>
// //             </div>
// //           </div>

// //           {/* Recent Transactions Card */}
// //           <div className="bg-white rounded-xl shadow-lg">
// //             <TransactionList limit={5} />
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default BalancePage;


// // src/components/BalancePage.jsx
// import React from 'react';
// import { useTransaction } from '../context/TransactionContext';

// const BalancePage = () => {
//   const { transactions } = useTransaction();

//   // Ensure transactions is an array before trying to reduce it
//   const amounts = transactions?.map(transaction => transaction.amount) || [];
//   const total = amounts.reduce((acc, item) => (acc += item), 0);

//   const income = amounts
//     .filter(item => item > 0)
//     .reduce((acc, item) => (acc += item), 0);

//   const expense = amounts
//     .filter(item => item < 0)
//     .reduce((acc, item) => (acc += item), 0) * -1;

//   return (
//     <div className="container mx-auto p-4 max-w-xl">
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">Your Balance</h2>
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
//           ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//         </h1>
//         <div className="flex justify-between bg-gray-100 rounded-lg p-4 shadow-sm text-gray-800">
//           <div className="text-center w-1/2 border-r border-gray-300">
//             <h4 className="text-lg font-semibold text-gray-600">Income</h4>
//             <p className="text-xl font-bold text-green-600">
//               + ₹ {income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//             </p>
//           </div>
//           <div className="text-center w-1/2">
//             <h4 className="text-lg font-semibold text-gray-600">Expense</h4>
//             <p className="text-xl font-bold text-red-600">
//               - ₹ {expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BalancePage;


// // src/components/BalancePage.jsx
// import React from 'react';
// import { useTransaction } from '../context/TransactionContext';

// const BalancePage = () => {
//   const { transactions } = useTransaction();

//   const amounts = transactions?.map(transaction => transaction.amount) || [];
//   const total = amounts.reduce((acc, item) => (acc += item), 0);

//   const income = amounts
//     .filter(item => item > 0)
//     .reduce((acc, item) => (acc += item), 0);

//   const expense = amounts
//     .filter(item => item < 0)
//     .reduce((acc, item) => (acc += item), 0) * -1;

//   return (
//     <div className="container mx-auto p-4 max-w-xl">
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">Your Balance</h2>
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
//           ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//         </h1>
//         <div className="flex justify-between bg-gray-100 rounded-lg p-4 shadow-sm text-gray-800">
//           <div className="text-center w-1/2 border-r border-gray-300">
//             <h4 className="text-lg font-semibold text-gray-600">Income</h4>
//             <p className="text-xl font-bold text-green-600">
//               + ₹ {income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//             </p>
//           </div>
//           <div className="text-center w-1/2">
//             <h4 className="text-lg font-semibold text-gray-600">Expense</h4>
//             <p className="text-xl font-bold text-red-600">
//               - ₹ {expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BalancePage;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useTransaction } from '../context/TransactionContext';
// import CategoryChart from './CategoryChart';

// const BalancePage = () => {
//   const { balance, transactions } = useTransaction();

//   return (
//     <main className="flex-grow p-4 md:p-8">
//       <div className="max-w-3xl mx-auto flex flex-col gap-6">

//         {/* Balance Card */}
//         <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//           <h1 className="text-xl font-bold text-gray-800">Current Balance</h1>
//           <p 
//             className="text-6xl font-extrabold mt-2 tracking-tight"
//             style={{ color: balance >= 0 ? '#10B981' : '#EF4444' }}
//           >
//             ₹{balance.toLocaleString('en-IN')}
//           </p>
//         </div>

//         {/* Quick Actions Card */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
//           <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
//             <Link
//               to="/add"
//               className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
//             >
//               Add Transaction
//             </Link>
//             <Link
//               to="/history"
//               className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
//             >
//               View History
//             </Link>
//           </div>
//         </div>
        
//         {/* New: Data Visualization Card */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">Spending Breakdown</h2>
//           <CategoryChart transactions={transactions} />
//         </div>
//       </div>
//     </main>
//   );
// };

// export default BalancePage;


import React from 'react';
import { Link } from 'react-router-dom';
import { useTransaction } from '../context/TransactionContext';
import CategoryChart from './CategoryChart';

const BalancePage = () => {
  // Destructure all three calculated values (balance, income, expense) from the context
  const { balance, income, expense, transactions } = useTransaction();
  
  // Helper function for clean INR formatting and handling absolute values
  const formatINR = (amount) => `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <main className="flex-grow p-4 md:p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Balance Summary Card (Net Balance) */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Current Net Balance</h1>
          <p 
            className="text-5xl font-extrabold tracking-tight"
            style={{ color: balance >= 0 ? '#10B981' : '#EF4444' }}
          >
            {formatINR(balance)}
          </p>

          {/* Income/Expense Breakdown Container */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="text-center flex-1">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">Total Income</h2>
              <p className="text-xl font-bold text-green-600 mt-1">
                + {formatINR(income)}
              </p>
            </div>
            <div className="text-center flex-1 border-l border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">Total Expense</h2>
              <p className="text-xl font-bold text-red-600 mt-1">
                - {formatINR(expense)}
              </p>
            </div>
          </div>
        </div>
         {/* Quick Actions Card */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/add"
              className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Add Transaction
            </Link>
            <Link
              to="/history"
              className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              View History
            </Link>
          </div>
        </div> */}

        {/* Data Visualization Card */}
        <div className="bg-white rounded-l shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Spending Breakdown</h2>
          <CategoryChart transactions={transactions} />
        </div>
        
       
        
      </div>
    </main>
  );
};

export default BalancePage;
