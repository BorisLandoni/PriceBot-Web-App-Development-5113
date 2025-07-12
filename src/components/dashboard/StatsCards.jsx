import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiShoppingCart, FiTrendingDown, FiTarget, FiDollarSign } = FiIcons;

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Prodotti Monitorati',
      value: stats.totalProducts,
      icon: FiShoppingCart,
      color: 'blue',
      change: '+2 questo mese'
    },
    {
      title: 'Monitoraggio Attivo',
      value: stats.activeMonitoring,
      icon: FiTrendingDown,
      color: 'green',
      change: 'In tempo reale'
    },
    {
      title: 'Obiettivi Raggiunti',
      value: stats.targetsReached,
      icon: FiTarget,
      color: 'purple',
      change: '+1 questa settimana'
    },
    {
      title: 'Risparmi Totali',
      value: `€${stats.totalSavings.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'yellow',
      change: '+€50 questo mese'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[card.color]}`}>
              <SafeIcon icon={card.icon} className="text-xl" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {card.value}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2">
            {card.title}
          </p>
          
          <p className="text-xs text-gray-500">
            {card.change}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;