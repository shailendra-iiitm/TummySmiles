import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'donor': return '/donor/dashboard';
      case 'agent': return '/agent/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b-4 border-orange-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">😊</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Tummy Smiles
              </h1>
              <p className="text-xs text-gray-500">Spreading joy through food</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                
                {user.role === 'donor' && (
                  <>
                    <Link 
                      to="/donor/create" 
                      className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Donate Food
                    </Link>
                    <Link 
                      to="/donor/my-donations" 
                      className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      My Donations
                    </Link>
                  </>
                )}

                {user.role === 'agent' && (
                  <>
                    <Link 
                      to="/agent/location" 
                      className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Update Location
                    </Link>
                    <Link 
                      to="/agent/status" 
                      className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Work Status
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-medium text-orange-600">{user.name || 'User'}</span>
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
                    {user.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-500 p-2 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-100 mb-2">
                    <p className="text-sm text-gray-600">
                      Welcome, <span className="font-medium text-orange-600">{user.name || 'User'}</span>
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize mt-1">
                      {user.role}
                    </span>
                  </div>
                  
                  <Link 
                    to={getDashboardLink()} 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {user.role === 'donor' && (
                    <>
                      <Link 
                        to="/donor/create" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Donate Food
                      </Link>
                      <Link 
                        to="/donor/my-donations" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Donations
                      </Link>
                    </>
                  )}

                  {user.role === 'agent' && (
                    <>
                      <Link 
                        to="/agent/location" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Update Location
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 text-white hover:bg-red-600 transition-colors mt-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
