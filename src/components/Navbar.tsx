import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, ClipboardList, Upload, LogOut, BarChart2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold flex items-center">
                <ClipboardList className="mr-2" size={24} />
                <span>AgentSync</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out ${isActive('/')}`}
                >
                  <span className="flex items-center">
                    <BarChart2 className="mr-1" size={18} />
                    Dashboard
                  </span>
                </Link>
                
                <Link
                  to="/agents"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out ${isActive('/agents')}`}
                >
                  <span className="flex items-center">
                    <User className="mr-1" size={18} />
                    Agents
                  </span>
                </Link>
                
                <Link
                  to="/upload"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out ${isActive('/upload')}`}
                >
                  <span className="flex items-center">
                    <Upload className="mr-1" size={18} />
                    Upload Lists
                  </span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Logout Button (Desktop) */}
          <div className="hidden md:block">
            <button
              onClick={logout}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out flex items-center"
            >
              <LogOut className="mr-1" size={18} />
              Logout
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 pb-3 px-2">
          <div className="space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150 ease-in-out ${isActive('/')}`}
              onClick={closeMenu}
            >
              <span className="flex items-center">
                <BarChart2 className="mr-2" size={18} />
                Dashboard
              </span>
            </Link>
            
            <Link
              to="/agents"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150 ease-in-out ${isActive('/agents')}`}
              onClick={closeMenu}
            >
              <span className="flex items-center">
                <User className="mr-2" size={18} />
                Agents
              </span>
            </Link>
            
            <Link
              to="/upload"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150 ease-in-out ${isActive('/upload')}`}
              onClick={closeMenu}
            >
              <span className="flex items-center">
                <Upload className="mr-2" size={18} />
                Upload Lists
              </span>
            </Link>
            
            <button
              onClick={() => {
                closeMenu();
                logout();
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              <span className="flex items-center">
                <LogOut className="mr-2" size={18} />
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;