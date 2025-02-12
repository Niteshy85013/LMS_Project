import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const initialAuthUser = localStorage.getItem("Users");
  
  const [authUser, setAuthUser] = useState(
    initialAuthUser ? JSON.parse(initialAuthUser) : undefined
  );

  // Sync authUser with localStorage whenever it changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("Users", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("Users");
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
