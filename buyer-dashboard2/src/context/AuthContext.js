import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to handle login and save token
  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("authToken", token); // Store token in localStorage
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
  };

  // Function to handle logout and clear token
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authToken"); // Remove token from localStorage
    localStorage.removeItem("user"); // Remove user data
    navigate("/login"); // Redirect to login page
  };

  // Check if user is authenticated by verifying the token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Protect routes by checking authentication state
  const requireAuth = (path) => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      navigate(path); // Redirect to desired path
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, requireAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
