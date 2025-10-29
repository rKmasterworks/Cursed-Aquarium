import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
// For Azure Static Web Apps, API is at /api (no localhost needed in production)
const API_URL = '/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('cursed_aquarium_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('cursed_aquarium_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cursed_aquarium_user');
  };

  const updatePassword = async (role, newPassword) => {
    if (user && user.hasAdminAccess) {
      try {
        const response = await fetch(`${API_URL}/passwords/${role}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: newPassword }),
        });

        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Password update error:', error);
        return false;
      }
    }
    return false;
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
