import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

// Components
import LoadingScreen from './components/common/LoadingScreen';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// Add more page imports as needed

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Check if it's first visit
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasVisited', 'true');
    setShowLoading(false);
  };

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showLoading ? (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        ) : (
          <div key="app" className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Add more routes */}
                {/* <Route path="/bikes" element={<Bikes />} /> */}
                {/* <Route path="/cars" element={<Cars />} /> */}
                {/* <Route path="/hostels" element={<Hostels />} /> */}

                {/* Protected Routes */}
                {/* <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} /> */}
                {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}

                {/* 404 */}
                <Route path="*" element={<div className="text-center py-20">404 - Page Not Found</div>} />
              </Routes>
            </main>
            <Footer />
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
