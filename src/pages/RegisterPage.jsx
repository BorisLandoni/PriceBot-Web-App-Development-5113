import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const { FiTarget, FiUser, FiMail, FiLock, FiArrowLeft } = FiIcons;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, {
        full_name: data.fullName,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Registrazione completata! Controlla la tua email per confermare l\'account.');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8">
            <SafeIcon icon={FiArrowLeft} />
            <span>Torna alla home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PriceBot</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Crea il tuo account
          </h2>
          <p className="text-gray-600">
            Inizia a monitorare i prezzi gratuitamente
          </p>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Nome completo"
                type="text"
                placeholder="inserisci il tuo nome"
                {...register('fullName', { 
                  required: 'Nome richiesto',
                  minLength: {
                    value: 2,
                    message: 'Il nome deve essere di almeno 2 caratteri'
                  }
                })}
                error={errors.fullName?.message}
              />
            </div>

            <div>
              <Input
                label="Email"
                type="email"
                placeholder="inserisci la tua email"
                {...register('email', { 
                  required: 'Email richiesta',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email non valida'
                  }
                })}
                error={errors.email?.message}
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="crea una password sicura"
                {...register('password', { 
                  required: 'Password richiesta',
                  minLength: {
                    value: 6,
                    message: 'La password deve essere di almeno 6 caratteri'
                  }
                })}
                error={errors.password?.message}
              />
            </div>

            <div>
              <Input
                label="Conferma password"
                type="password"
                placeholder="conferma la tua password"
                {...register('confirmPassword', { 
                  required: 'Conferma password richiesta',
                  validate: value => value === password || 'Le password non corrispondono'
                })}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('agreeTerms', { required: 'Devi accettare i termini di servizio' })}
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                Accetto i{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  termini di servizio
                </a>{' '}
                e la{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  privacy policy
                </a>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Crea Account
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Hai già un account? </span>
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Accedi qui
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
        >
          <h3 className="text-lg font-semibold mb-4">
            🎉 Registrandoti ottieni:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>Monitoraggio illimitato di prodotti</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>Notifiche in tempo reale</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>Dashboard personalizzata</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>Grafici e analisi avanzate</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;