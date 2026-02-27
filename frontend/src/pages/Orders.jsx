import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Package, CreditCard, X } from 'lucide-react';
import Loader from '../components/common/Loader';
import orderService from '../services/orderService';
import { formatDate, formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      ongoing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.pending;
  };

  const getServiceImage = (serviceType) => {
    const images = {
      bike: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&h=150&fit=crop',
      car: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=150&fit=crop',
      hostel: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&h=150&fit=crop',
    };
    return images[serviceType] || images.bike;
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your bookings
          </p>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-20"
          >
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start exploring and book your first ride!
            </p>
            <button
              onClick={() => window.location.href = '/bikes'}
              className="btn-primary"
            >
              Browse Vehicles
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Service Image */}
                  <div className="w-full md:w-48 h-40 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={getServiceImage(order.serviceType)}
                      alt={order.serviceType}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1 capitalize">
                          {order.serviceType} Booking
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Order ID: {order._id.slice(-8)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {order.startDate && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(order.startDate)} - {formatDate(order.endDate)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CreditCard className="h-4 w-4" />
                        <span>Payment: {order.paymentStatus || 'Pending'}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Notes:</strong> {order.notes}
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(order.price)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Booked on {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

