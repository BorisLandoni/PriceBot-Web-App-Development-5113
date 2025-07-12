import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

const { FiExternalLink, FiTrash2, FiEdit, FiTrendingDown, FiTrendingUp, FiTarget } = FiIcons;

const ProductList = ({ products, loading, onDelete, onSelect, onEdit }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-center text-gray-600 mt-4">Caricamento prodotti...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiTarget} className="text-2xl text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nessun prodotto monitorato
        </h3>
        <p className="text-gray-600 mb-6">
          Inizia aggiungendo il primo prodotto da monitorare
        </p>
        <Button>
          <SafeIcon icon={FiTarget} className="mr-2" /> Aggiungi Prodotto
        </Button>
      </motion.div>
    );
  }

  const getStatusColor = (current_price, target_price) => {
    if (current_price <= target_price) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (current_price, target_price) => {
    if (current_price <= target_price) {
      return 'Obiettivo Raggiunto';
    }
    return 'Monitoraggio';
  };

  const getPriceIcon = (currentPrice, targetPrice) => {
    if (currentPrice <= targetPrice) {
      return { icon: FiTrendingDown, color: 'text-green-600' };
    }
    return { icon: FiTrendingUp, color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          I tuoi prodotti ({products.length})
        </h2>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => {
          const priceInfo = getPriceIcon(product.current_price, product.target_price);
          const formattedDate = new Date(product.last_checked || new Date());
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(product)}
            >
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={priceInfo.icon} className={`${priceInfo.color}`} />
                          <span className="text-xl font-bold text-gray-900">
                            €{product.current_price}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          Obiettivo: <span className="font-medium">€{product.target_price}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          Ultimo controllo: {formatDistanceToNow(formattedDate, { addSuffix: true, locale: it })}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            product.current_price,
                            product.target_price
                          )}`}
                        >
                          {getStatusText(product.current_price, product.target_price)}
                        </span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(product.url, '_blank');
                        }}
                      >
                        <SafeIcon icon={FiExternalLink} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(product);
                        }}
                      >
                        <SafeIcon icon={FiEdit} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(product.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;