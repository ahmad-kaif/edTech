import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiBook, FiMessageSquare, FiHome, FiSettings } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeProvider';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className={`h-4 w-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 ${isLoaded ? 'animate-pulse' : ''}`}></div>
            <span className="font-bold text-xl tracking-tight text-white">Learning Platform</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                  }
                >
                  <div className="flex items-center space-x-1">
                    <FiHome className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink 
                  to="/classes" 
                  className={({ isActive }) => 
                    `text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                  }
                >
                  <div className="flex items-center space-x-1">
                    <FiBook className="w-4 h-4" />
                    <span>Classes</span>
                  </div>
                </NavLink>
                <NavLink 
                  to="/discussions" 
                  className={({ isActive }) => 
                    `text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                  }
                >
                  <div className="flex items-center space-x-1">
                    <FiMessageSquare className="w-4 h-4" />
                    <span>Discussions</span>
                  </div>
                </NavLink>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="text-sm uppercase tracking-widest text-white/80 hover:text-blue-400 transition-colors flex items-center space-x-1">
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden backdrop-blur-md bg-black/50 border border-white/10 
                    opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 origin-top-right transition-all duration-200">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-white/80 hover:text-blue-400 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FiUser className="w-4 h-4" />
                          <span>View Profile</span>
                        </div>
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-white/80 hover:text-blue-400 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FiSettings className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <button 
                        onClick={logout} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm uppercase tracking-widest text-white/80 hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 text-sm font-medium tracking-wider text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all backdrop-blur-sm text-white text-sm font-medium tracking-wide hidden md:block"
          >
            {isDark ? '🌞' : '🌙'}
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-white p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden mt-4 py-4 rounded-xl backdrop-blur-md bg-black/50 border border-white/10 transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {isAuthenticated ? (
              <div className="space-y-3 px-4">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `block py-2 text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-blue-400' : 'text-white/80'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FiHome className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink 
                  to="/classes" 
                  className={({ isActive }) => 
                    `block py-2 text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-blue-400' : 'text-white/80'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FiBook className="w-4 h-4" />
                    <span>Classes</span>
                  </div>
                </NavLink>
                <NavLink 
                  to="/discussions" 
                  className={({ isActive }) => 
                    `block py-2 text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-blue-400' : 'text-white/80'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FiMessageSquare className="w-4 h-4" />
                    <span>Discussions</span>
                  </div>
                </NavLink>
                <Link 
                  to="/profile" 
                  className="block py-2 text-sm uppercase tracking-widest text-white/80 hover:text-blue-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="py-2 text-sm uppercase tracking-widest text-red-400 transition-colors flex items-center space-x-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white"
                  >
                    {isDark ? '🌞' : '🌙'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                <Link 
                  to="/login" 
                  className="block py-2 text-sm uppercase tracking-widest text-white/80 hover:text-blue-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all text-white text-sm uppercase tracking-widest text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex justify-end">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white"
                  >
                    {isDark ? '🌞' : '🌙'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;