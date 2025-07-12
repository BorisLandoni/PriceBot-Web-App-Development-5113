import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingDown, FiTrendingUp, FiBarChart3 } = FiIcons;

const PriceChart = ({ selectedProduct }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (selectedProduct) {
      loadPriceHistory();
    }
  }, [selectedProduct, timeRange]);

  const loadPriceHistory = async () => {
    // Mock price history data
    const mockData = [
      { date: '2024-01-15', price: 1299.99 },
      { date: '2024-01-16', price: 1289.99 },
      { date: '2024-01-17', price: 1279.99 },
      { date: '2024-01-18', price: 1269.99 },
      { date: '2024-01-19', price: 1259.99 },
      { date: '2024-01-20', price: selectedProduct?.current_price || 1199.99 },
    ];
    setPriceHistory(mockData);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { 
      month: 'short', 
      day: 'numeric' 
    });
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
            src={selectedProduct.image}
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
              <div className={`flex items-center space-x-1 ${
                priceChange < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
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
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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