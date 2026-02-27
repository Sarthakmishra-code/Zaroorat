import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ShoppingCart, LayoutDashboard, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes' },
    { name: 'Cars', path: '/cars' },
    { name: 'Hostels', path: '/hostels' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-b border-transparent shadow-lg text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              <Compass className="h-8 w-8" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Zaroorat
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white/90 hover:text-white transition-colors font-medium hover:underline decoration-2 underline-offset-4"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/orders"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Orders</span>
                </Link>

                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-blue-600 hover:bg-gray-100 transition shadow-sm"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-bold">{user?.fullname}</span>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-white/20 hover:bg-red-500 hover:text-white transition"
                  >
                    <LogOut className="h-5 w-5" />
                  </motion.button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl bg-white text-blue-600 font-bold hover:bg-gray-100 transition shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-dark-600">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg bg-blue-600 text-white text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
