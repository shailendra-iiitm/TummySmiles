import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './createContext';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          console.log('Decoded token:', decoded);
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          } else {
            setToken(storedToken);
            setUser(decoded);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for token changes
  useEffect(() => {
    if (token && !isLoading) {
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
    } else if (!token && !isLoading) {
      setUser(null);
    }
  }, [token, isLoading]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const login = (tokenValue) => {
    try {
      const decoded = jwtDecode(tokenValue);
      
      // Check if token is valid and not expired
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token is expired');
      }
      
      localStorage.setItem('token', tokenValue);
      setToken(tokenValue);
      setUser(decoded);
    } catch (error) {
      console.error('Invalid token during login:', error);
      logout();
      throw error; // Re-throw so login component can handle it
    }
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      setToken, 
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
