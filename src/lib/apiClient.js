import axios from 'axios';

// Configurazione di base di axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Crea un'istanza di axios con configurazioni di base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per gestire token di autenticazione
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor per gestire errori di risposta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestione centralizzata degli errori
    if (error.response && error.response.status === 401) {
      // Gestione token scaduto o non valido
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API per i prodotti
export const productApi = {
  // Ottiene tutti i prodotti
  getProducts: async () => {
    try {
      const response = await apiClient.get('/products/');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Ottiene un singolo prodotto per ID
  getProduct: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Crea un nuovo prodotto
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products/', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Aggiorna un prodotto esistente
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Elimina un prodotto
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Ottiene la cronologia prezzi di un prodotto
  getPriceHistory: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}/price-history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching price history for product ${id}:`, error);
      throw error;
    }
  },
};

// API per l'autenticazione
export const authApi = {
  // Login utente
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      // Salva il token di autenticazione
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Registrazione utente
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout utente
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Controlla se l'utente è autenticato
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Ottiene l'utente corrente
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// API per le notifiche
export const notificationApi = {
  // Ottiene tutte le notifiche per l'utente
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/notifications/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Segna una notifica come letta
  markAsRead: async (id) => {
    try {
      const response = await apiClient.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },
};

// API per le impostazioni utente
export const userSettingsApi = {
  // Ottiene le impostazioni dell'utente
  getSettings: async () => {
    try {
      const response = await apiClient.get('/user/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  },

  // Aggiorna le impostazioni dell'utente
  updateSettings: async (settings) => {
    try {
      const response = await apiClient.put('/user/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },
};

// Esportazione del client API completo
export default {
  product: productApi,
  auth: authApi,
  notification: notificationApi,
  userSettings: userSettingsApi,
};