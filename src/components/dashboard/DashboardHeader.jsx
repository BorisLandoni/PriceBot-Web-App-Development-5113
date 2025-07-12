import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const { FiTarget, FiLogOut, FiSettings, FiUser } = FiIcons;

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout effettuato con successo');
      navigate('/');
    } catch (error) {
      toast.error('Errore durante il logout');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-900">PriceBot</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/products" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Prodotti
            </Link>
            <Link 
              to="/analytics" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Analytics
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="text-gray-600" />
              </div>
              <span className="text-gray-700">
                {user?.email}
              </span>
            </div>
            
            <Button variant="ghost" size="sm">
              <SafeIcon icon={FiSettings} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700"
            >
              <SafeIcon icon={FiLogOut} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;