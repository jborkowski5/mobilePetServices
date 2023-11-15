// AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set the initial state to false

  // Function to set the login status
  const setLoginStatus = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
