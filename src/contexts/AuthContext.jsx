import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/apiClient';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Creazione del contesto per l'autenticazione
const AuthContext = createContext({});

// Hook personalizzato per utilizzare il contesto di autenticazione
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider del contesto di autenticazione
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Effetto per verificare lo stato di autenticazione all'avvio
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const currentUser = authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // In caso di errore, rimuovi i dati di autenticazione
        authApi.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Funzione per effettuare il login
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      setUser(response.user);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Funzione per effettuare la registrazione
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const response = await authApi.register({ email, password, ...userData });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Funzione per effettuare il logout
  const signOut = async () => {
    try {
      authApi.logout();
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Funzione per reimpostare la password
  const resetPassword = async (email) => {
    try {
      const response = await authApi.resetPassword(email);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Valori forniti dal contesto
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner size="lg" className="fixed inset-0 m-auto" /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;