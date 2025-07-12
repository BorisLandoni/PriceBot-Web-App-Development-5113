import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/common/Button';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProductList from '../components/dashboard/ProductList';
import AddProductModal from '../components/dashboard/AddProductModal';
import StatsCards from '../components/dashboard/StatsCards';
import PriceChart from '../components/dashboard/PriceChart';

const { FiPlus, FiTrendingDown, FiBell, FiShoppingCart, FiDollarSign } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // For now, use mock data until backend is connected
      const mockProducts = [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          url: 'https://example.com/iphone-15-pro',
          current_price: 1199.99,
          target_price: 1000.00,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
          status: 'monitoring',
          created_at: '2024-01-15T10:00:00Z',
          last_checked: '2024-01-20T15:30:00Z'
        },
        {
          id: 2,
          name: 'MacBook Air M3',
          url: 'https://example.com/macbook-air-m3',
          current_price: 1399.99,
          target_price: 1200.00,
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
          status: 'monitoring',
          created_at: '2024-01-10T14:20:00Z',
          last_checked: '2024-01-20T15:25:00Z'
        },
        {
          id: 3,
          name: 'Sony WH-1000XM5',
          url: 'https://example.com/sony-headphones',
          current_price: 299.99,
          target_price: 250.00,
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
          status: 'target_reached',
          created_at: '2024-01-08T09:15:00Z',
          last_checked: '2024-01-20T15:20:00Z'
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      toast.error('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      // Mock add product
      const newProduct = {
        id: Date.now(),
        ...productData,
        status: 'monitoring',
        created_at: new Date().toISOString(),
        last_checked: new Date().toISOString()
      };
      
      setProducts(prev => [newProduct, ...prev]);
      setShowAddModal(false);
      toast.success('Prodotto aggiunto con successo!');
    } catch (error) {
      toast.error('Errore nell\'aggiunta del prodotto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Prodotto rimosso con successo!');
    } catch (error) {
      toast.error('Errore nella rimozione del prodotto');
    }
  };

  const stats = {
    totalProducts: products.length,
    activeMonitoring: products.filter(p => p.status === 'monitoring').length,
    targetsReached: products.filter(p => p.status === 'target_reached').length,
    totalSavings: products.reduce((acc, p) => {
      if (p.status === 'target_reached') {
        return acc + (p.current_price - p.target_price);
      }
      return acc;
    }, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ciao, {user?.user_metadata?.full_name || 'Utente'}! 👋
          </h1>
          <p className="text-gray-600">
            Ecco un riepilogo dei tuoi prodotti monitorati
          </p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>Aggiungi Prodotto</span>
          </Button>
          
          <Button variant="outline">
            <SafeIcon icon={FiBell} className="mr-2" />
            Impostazioni Notifiche
          </Button>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <ProductList
              products={products}
              loading={loading}
              onDelete={handleDeleteProduct}
              onSelect={setSelectedProduct}
            />
          </div>

          {/* Price Chart */}
          <div className="lg:col-span-1">
            <PriceChart selectedProduct={selectedProduct} />
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
};

export default Dashboard;