import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './createContext';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
