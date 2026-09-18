import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (persisted in localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // SIGNUP API CALL
  const signup = async (email, password, name = "New User") => {
    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Connection Error: Server returned HTML but we expected JSON. Your VITE_API_URL (${API_URL}) might be wrong. Check if your backend is pointing to the frontend URL!`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }
      return data;
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message);
      throw error;
    }
  };

  // LOGIN FUNCTION with ADMIN BYPASS & BLOCKED CHECK
  const login = async (email, password) => {
    if (email === 'admin@19' && password === 'raj27') {
      const adminUser = { id: 999, name: "Admin", email: 'admin@19', role: 'admin' };
      setCurrentUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return adminUser;
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned HTML instead of JSON. Check your VITE_API_URL. (Status: ${response.status})`);
      }

      const data = await response.json();

      if (response.status === 403) {
        alert("Your account is BLOCKED. Please contact the Admin.");
        throw new Error("Account Blocked");
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setCurrentUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;

    } catch (error) {
      console.error("Login Error:", error);
      if (error.message !== "Account Blocked") {
        alert(error.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear(); // Complete cleanup
    setCurrentUser(null);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};