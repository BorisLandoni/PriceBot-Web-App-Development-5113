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

const { FiTarget, FiMail, FiLock, FiArrowLeft } = FiIcons;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Accesso effettuato con successo!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Errore durante l\'accesso');
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
            Bentornato!
          </h2>
          <p className="text-gray-600">
            Accedi al tuo account per continuare a monitorare i prezzi
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="inserisci la tua password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ricordami
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Password dimenticata?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Accedi
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Non hai un account? </span>
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Registrati qui
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cosa puoi fare con PriceBot:
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center space-x-2">
              <SafeIcon icon={FiTarget} className="text-blue-600 text-sm" />
              <span>Monitora prezzi automaticamente</span>
            </li>
            <li className="flex items-center space-x-2">
              <SafeIcon icon={FiTarget} className="text-blue-600 text-sm" />
              <span>Ricevi notifiche istantanee</span>
            </li>
            <li className="flex items-center space-x-2">
              <SafeIcon icon={FiTarget} className="text-blue-600 text-sm" />
              <span>Visualizza grafici dei prezzi</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;