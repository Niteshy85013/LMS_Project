/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Make sure you install axios if not already installed

// Create context for authentication
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("Users");
      return storedUser ? JSON.parse(storedUser) : null; // Ensure the fallback is null
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null; // Fallback if parsing fails
    }
  });

  // Sync authUser with localStorage whenever it changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("Users", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("Users");
    }
  }, [authUser]);

  // Example: Fetch user data from the backend API (Express server)
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get("/api/auth/validate-token", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Get token from localStorage
          },
        });
        if (response.data.isValid) {
          setAuthUser(response.data.user);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        // Handle error (e.g., clear user data or show a message)
        setAuthUser(null);
      }
    };

    // Only validate the token if it's present in localStorage
    if (localStorage.getItem("token")) {
      validateToken();
    }
  }, []);

  if (authUser === undefined) {
    return <div>Loading...</div>; // Optional loading state if needed
  }

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);
