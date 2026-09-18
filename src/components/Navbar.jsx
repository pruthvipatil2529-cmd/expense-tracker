// // src/components/Navbar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { AiOutlineLogout, AiOutlineLogin } from 'react-icons/ai';


// const Navbar = () => {


//  const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//     } catch (error) {
//       console.error('Failed to log out:', error);
//     }
//   };

//   return (
//     <header className="bg-gray-800 text-white p-6 mt-0 shadow-md">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-xl font-bold">
//           Daily Balance
//         </Link>
//         <nav className="flex space-x-4 items-center">
//           {currentUser && (
//             <>
//               <Link to="/" className="hover:text-gray-300 transition-colors">
//                 Dashboard
//               </Link>
//               <Link to="/add" className="hover:text-gray-300 transition-colors">
//                 Add Transaction
//               </Link>
//               <Link to="/history" className="hover:text-gray-300 transition-colors">
//                 History
//               </Link>
//             </>
//           )}
//           {currentUser ? (
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded flex items-center"
//             >
//               <AiOutlineLogout className="mr-2" /> Logout
//             </button>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-gray-300 transition-colors flex items-center">
//                 <AiOutlineLogin className="mr-2" /> Login
//               </Link>
//               <Link to="/signup" className="hover:text-gray-300 transition-colors">
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Navbar;



// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AiOutlineLogout,
  AiOutlineLogin,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg z-50 backdrop-blur">
      <div className="flex justify-between items-center py-4 px-6 md:px-10">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          Daily Balance
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>

        {/* Nav Links */}
        <nav
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-gray-900/95 md:bg-transparent space-y-6 md:space-y-0 md:space-x-10 px-6 md:px-0 py-6 md:py-0 shadow-md md:shadow-none`}
        >
          {currentUser && (
            <>
              <Link
                to="/"
                className="text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/add"
                className="text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                Add Transaction
              </Link>
              <Link
                to="/history"
                className="text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                History
              </Link>
            </>
          )}

          {/* Auth Buttons */}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium text-sm shadow-md hover:scale-105 transition-all"
            >
              <AiOutlineLogout className="mr-2 text-lg" /> Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-gray-300 hover:text-indigo-400 font-medium transition-all"
              >
                <AiOutlineLogin className="mr-1 text-lg" /> Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 px-6 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
