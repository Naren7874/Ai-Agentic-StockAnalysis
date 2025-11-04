import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Dummy user data for demonstration
  const dummyUsers = [
    { id: 1, email: 'user@example.com', username: 'demouser', password: 'password123' }
  ];

  const login = async (email, password) => {
    setLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = dummyUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const userData = { 
            id: user.id, 
            email: user.email, 
            username: user.username 
          };
          setUser(userData);
          localStorage.setItem('token', 'dummy-token');
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
        setLoading(false);
      }, 1000);
    });
  };

  const signup = async (email, username, password) => {
    setLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = dummyUsers.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('User already exists with this email'));
          return;
        }

        // Create new user (in a real app, this would be an API call)
        const newUser = {
          id: Date.now(),
          email,
          username,
          password
        };

        // Add to dummy users (for demo purposes)
        dummyUsers.push(newUser);

        const userData = { 
          id: newUser.id, 
          email: newUser.email, 
          username: newUser.username 
        };
        setUser(userData);
        localStorage.setItem('token', 'dummy-token');
        localStorage.setItem('user', JSON.stringify(userData));
        resolve(userData);
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};