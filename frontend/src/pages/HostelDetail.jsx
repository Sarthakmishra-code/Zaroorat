import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Wifi, Star, AlertCircle, CheckCircle2, ChevronLeft, Thermometer, Info } from 'lucide-react';
import toast from 'react-hot-toast';

import vehicleService from '../services/vehicleService';
import orderService from '../services/orderService';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const HostelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHostelDetails();
  }, [id]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getHostelById(id);
      setHostel(response.data);
    } catch (error) {
      toast.error('Failed to load hostel details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a hostel');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const orderData = {
        serviceType: 'hostel',
        serviceObjectId: hostel._id,
        serviceModel: 'Hostel',
        price: hostel.price,
      };

      await orderService.createOrder(orderData);
      toast.success('Hostel booking request sent successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place booking');
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!hostel) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Hostel Not Found</h2>
        <button onClick={() => navigate('/hostels')} className="btn-primary">
          Back to Hostels
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/hostels')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-8 transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Hostels
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]"
          >
            <img
              src={hostel.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&fit=crop'}
              alt={hostel.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&fit=crop'; }}
            />
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2">
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-sm font-semibold px-3 py-1 rounded-full">
                Hostel Accommmodation
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {hostel.name}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 flex items-start gap-2">
              <Info className="h-5 w-5 mt-1 shrink-0 text-gray-400" />
              <span>{hostel.description || 'A comfortable living space perfect for students and professionals. Equipped with basic amenities to make your stay pleasant.'}</span>
            </p>

            <div className="card bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <Users className="h-6 w-6 text-purple-500 mb-2" />
                  <p className="text-sm font-medium">{hostel.roomCapacity} Person</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <Thermometer className={`h-6 w-6 mb-2 ${hostel.ac ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">{hostel.ac ? 'AC Room' : 'Non-AC'}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <Wifi className="h-6 w-6 text-green-500 mb-2" />
                  <p className="text-sm font-medium">Free WiFi</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <Star className="h-6 w-6 text-yellow-500 mb-2" />
                  <p className="text-sm font-medium">4.3 / 5.0</p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-6 mt-2">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-gray-500 mb-1">Monthly Rent</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(hostel.price)}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hostel.availability ? (
                      <span className="flex items-center gap-1 text-green-600 font-semibold px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle2 className="h-5 w-5" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-semibold px-4 py-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <AlertCircle className="h-5 w-5" /> Full
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!hostel.availability || bookingLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {bookingLoading ? 'Processing...' : (hostel.availability ? 'Book Now' : 'Not Available')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetail;
