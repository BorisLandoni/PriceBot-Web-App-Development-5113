import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../common/Button';
import Input from '../common/Input';

const { FiX, FiLink, FiDollarSign, FiTag } = FiIcons;

const AddProductModal = ({ onClose, onAdd, product = null, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: product ? {
      name: product.name,
      url: product.url,
      current_price: product.current_price,
      target_price: product.target_price
    } : {}
  });
  
  const url = watch('url');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepara i dati del prodotto
      const productData = {
        ...data,
        current_price: parseFloat(data.current_price) || 0,
        target_price: parseFloat(data.target_price),
        image: product?.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'
      };
      
      // Se stiamo modificando, aggiungi l'ID
      if (isEditing && product) {
        productData.id = product.id;
      }
      
      // Chiama la funzione di callback
      await onAdd(productData);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <SafeIcon icon={FiX} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <Input
              label="URL del prodotto"
              type="url"
              placeholder="https://example.com/prodotto"
              {...register('url', {
                required: 'URL richiesto',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'URL non valido'
                }
              })}
              error={errors.url?.message}
              disabled={isEditing}
            />
            <p className="text-xs text-gray-500 mt-1">
              {isEditing ? "L'URL non può essere modificato" : "Incolla l'URL del prodotto da monitorare"}
            </p>
          </div>

          <div>
            <Input
              label="Nome del prodotto"
              type="text"
              placeholder="iPhone 15 Pro"
              {...register('name', {
                required: 'Nome richiesto',
                minLength: {
                  value: 2,
                  message: 'Il nome deve essere di almeno 2 caratteri'
                }
              })}
              error={errors.name?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Prezzo attuale (€)"
                type="number"
                step="0.01"
                placeholder="999.99"
                {...register('current_price', {
                  valueAsNumber: true,
                  validate: value => 
                    !isNaN(value) && value >= 0 || 'Il prezzo deve essere un numero positivo'
                })}
                error={errors.current_price?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isEditing ? "Prezzo attuale rilevato" : "Opzionale - verrà rilevato automaticamente"}
              </p>
            </div>
            <div>
              <Input
                label="Prezzo obiettivo (€)"
                type="number"
                step="0.01"
                placeholder="799.99"
                {...register('target_price', {
                  required: 'Prezzo obiettivo richiesto',
                  valueAsNumber: true,
                  min: {
                    value: 0.01,
                    message: 'Il prezzo deve essere maggiore di 0'
                  }
                })}
                error={errors.target_price?.message}
              />
            </div>
          </div>

          {!isEditing && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                📱 Come funziona:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Monitoriamo il prezzo ogni ora</li>
                <li>• Ti avvisiamo quando scende sotto l'obiettivo</li>
                <li>• Puoi modificare l'obiettivo in qualsiasi momento</li>
              </ul>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Annulla
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {isEditing ? 'Salva Modifiche' : 'Aggiungi Prodotto'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProductModal;