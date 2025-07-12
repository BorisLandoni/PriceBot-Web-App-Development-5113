import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SafeIcon from '../../common/SafeIcon';
import { productApi } from '../../lib/apiClient';
import LoadingSpinner from '../common/LoadingSpinner';

const { FiTrendingDown, FiTrendingUp, FiBarChart3 } = FiIcons;

const PriceChart = ({ selectedProduct }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      loadPriceHistory();
    }
  }, [selectedProduct, timeRange]);

  const loadPriceHistory = async () => {
    if (!selectedProduct || !selectedProduct.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Tenta di ottenere la cronologia dei prezzi dall'API
      const history = await productApi.getPriceHistory(selectedProduct.id);
      
      // Se non ci sono dati o si verifica un errore, usa dati di esempio
      if (!history || history.length === 0) {
        // Genera dati di esempio per la demo
        const mockData = generateMockPriceHistory(selectedProduct);
        setPriceHistory(mockData);
      } else {
        // Usa i dati reali dall'API
        setPriceHistory(history);
      }
    } catch (err) {
      console.error('Error loading price history:', err);
      setError('Impossibile caricare la cronologia dei prezzi');
      
      // Fallback ai dati di esempio in caso di errore
      const mockData = generateMockPriceHistory(selectedProduct);
      setPriceHistory(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per generare dati di esempio per la demo
  const generateMockPriceHistory = (product) => {
    const today = new Date();
    const data = [];
    
    // Determina il numero di giorni in base al range selezionato
    let days = 7;
    if (timeRange === '30d') days = 30;
    if (timeRange === '90d') days = 90;
    
    // Genera un prezzo iniziale leggermente superiore al prezzo attuale
    const startPrice = product.current_price * 1.1;
    
    // Genera dati per ogni giorno
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Calcola un prezzo che gradualmente scende verso il prezzo attuale
      const progress = (days - i) / days;
      const randomFactor = 0.98 + Math.random() * 0.04; // Fattore casuale tra 0.98 e 1.02
      const price = startPrice - (startPrice - product.current_price) * progress * randomFactor;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (price) => `€${price.toFixed(2)}`;

  const priceChange = priceHistory.length > 1 
    ? priceHistory[priceHistory.length - 1].price - priceHistory[0].price 
    : 0;
    
  const priceChangePercent = priceHistory.length > 1 
    ? ((priceChange / priceHistory[0].price) * 100) 
    : 0;

  if (!selectedProduct) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiBarChart3} className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Grafico Prezzi
          </h3>
          <p className="text-gray-600">
            Seleziona un prodotto per visualizzare l'andamento dei prezzi
          </p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <div className="text-center py-12">
          <LoadingSpinner size="lg" className="mx-auto" />
          <p className="text-gray-600 mt-4">Caricamento dati prezzi...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <div className="text-center py-12 text-red-500">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiBarChart3} className="text-2xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Errore</h3>
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Andamento Prezzi
          </h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 giorni</option>
            <option value="30d">30 giorni</option>
            <option value="90d">90 giorni</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={selectedProduct.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"}
            alt={selectedProduct.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium text-gray-900">
              {selectedProduct.name}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(selectedProduct.current_price)}
              </span>
              <div
                className={`flex items-center space-x-1 ${
                  priceChange < 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <SafeIcon
                  icon={priceChange < 0 ? FiTrendingDown : FiTrendingUp}
                  className="text-sm"
                />
                <span className="text-sm font-medium">
                  {priceChangePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                tickFormatter={formatPrice}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip
                formatter={(value) => [formatPrice(value), 'Prezzo']}
                labelFormatter={(label) => `Data: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              {/* Target price line */}
              <Line
                type="monotone"
                dataKey={() => selectedProduct.target_price}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-gray-600">Prezzo attuale</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-red-500 border-dashed"></div>
            <span className="text-gray-600">Prezzo obiettivo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceChart;