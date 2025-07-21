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
      } catch {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const login = (tokenValue) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
    try {
      const decoded = jwtDecode(tokenValue);
      setUser(decoded);
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
