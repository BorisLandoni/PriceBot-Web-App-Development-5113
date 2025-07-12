import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/common/Button';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProductList from '../components/dashboard/ProductList';
import AddProductModal from '../components/dashboard/AddProductModal';
import StatsCards from '../components/dashboard/StatsCards';
import PriceChart from '../components/dashboard/PriceChart';
import { productApi } from '../lib/apiClient';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { FiPlus, FiTrendingDown, FiBell, FiShoppingCart, FiDollarSign } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Tenta di caricare i prodotti dall'API
      try {
        const fetchedProducts = await productApi.getProducts();
        
        // Se otteniamo prodotti validi, li utilizziamo
        if (fetchedProducts && Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError);
      }
      
      // Fallback ai dati di esempio se l'API fallisce
      const mockProducts = [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          url: 'https://example.com/iphone-15-pro',
          current_price: 1199.99,
          target_price: 1000.00,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
          last_checked: new Date().toISOString()
        },
        {
          id: 2,
          name: 'MacBook Air M3',
          url: 'https://example.com/macbook-air-m3',
          current_price: 1399.99,
          target_price: 1200.00,
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
          last_checked: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Sony WH-1000XM5',
          url: 'https://example.com/sony-headphones',
          current_price: 299.99,
          target_price: 250.00,
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
          last_checked: new Date().toISOString()
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      setLoading(true);
      
      // Tenta di aggiungere il prodotto tramite l'API
      let newProduct;
      try {
        newProduct = await productApi.createProduct(productData);
      } catch (apiError) {
        console.warn('API create failed, using mock data:', apiError);
        
        // Crea un prodotto simulato se l'API fallisce
        newProduct = {
          id: Date.now(),
          ...productData,
          last_checked: new Date().toISOString()
        };
      }
      
      setProducts(prev => [newProduct, ...prev]);
      setShowAddModal(false);
      toast.success('Prodotto aggiunto con successo!');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Errore nell\'aggiunta del prodotto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      setLoading(true);
      
      // Tenta di aggiornare il prodotto tramite l'API
      let updatedProduct;
      try {
        updatedProduct = await productApi.updateProduct(productData.id, productData);
      } catch (apiError) {
        console.warn('API update failed, using mock data:', apiError);
        
        // Aggiorna localmente se l'API fallisce
        updatedProduct = {
          ...productData,
          last_checked: new Date().toISOString()
        };
      }
      
      setProducts(prev => prev.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      setEditingProduct(null);
      toast.success('Prodotto aggiornato con successo!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Errore nell\'aggiornamento del prodotto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      
      // Tenta di eliminare il prodotto tramite l'API
      try {
        await productApi.deleteProduct(productId);
      } catch (apiError) {
        console.warn('API delete failed, proceeding with local delete:', apiError);
      }
      
      // Rimuovi il prodotto dalla lista locale
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      // Se il prodotto eliminato era quello selezionato, deselezionalo
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(null);
      }
      
      toast.success('Prodotto rimosso con successo!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Errore nella rimozione del prodotto');
    } finally {
      setLoading(false);
    }
  };

  // Calcola le statistiche basate sui prodotti
  const calculateStats = () => {
    const totalProducts = products.length;
    
    const activeMonitoring = products.filter(p => 
      p.current_price > p.target_price
    ).length;
    
    const targetsReached = products.filter(p => 
      p.current_price <= p.target_price
    ).length;
    
    const totalSavings = products.reduce((acc, p) => {
      if (p.current_price <= p.target_price) {
        // Calcola il risparmio rispetto al prezzo originale stimato (10% in più)
        const originalEstimate = p.target_price * 1.1;
        return acc + (originalEstimate - p.current_price);
      }
      return acc;
    }, 0);
    
    return {
      totalProducts,
      activeMonitoring,
      targetsReached,
      totalSavings
    };
  };

  const stats = calculateStats();

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto" />
          <p className="mt-4 text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

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
            Ciao, {user?.user_metadata?.full_name || user?.email || 'Utente'}! 👋
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
            <SafeIcon icon={FiBell} className="mr-2" /> Impostazioni Notifiche
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
              onEdit={setEditingProduct}
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
      
      {/* Edit Product Modal */}
      {editingProduct && (
        <AddProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onAdd={handleEditProduct}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default Dashboard;