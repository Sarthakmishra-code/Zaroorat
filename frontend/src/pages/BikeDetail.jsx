import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Droplet, Star, AlertCircle, CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

import vehicleService from '../services/vehicleService';
import orderService from '../services/orderService';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const BikeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [rentalType, setRentalType] = useState('day');

  useEffect(() => {
    fetchBikeDetails();
  }, [id]);

  const fetchBikeDetails = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getBikeById(id);
      setBike(response.data);
    } catch (error) {
      toast.error('Failed to load bike details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a bike');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const orderData = {
        serviceType: 'bike',
        serviceObjectId: bike._id,
        serviceModel: 'Bike',
        price: rentalType === 'hour' ? bike.pricePerHour : bike.price,
        rentalType
      };

      await orderService.createOrder(orderData);
      toast.success('Bike booking request sent successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place booking');
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!bike) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Bike Not Found</h2>
        <button onClick={() => navigate('/bikes')} className="btn-primary">
          Back to Bikes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/bikes')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-8 transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Bikes
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]"
          >
            <img
              src={bike.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&fit=crop'}
              alt={bike.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&fit=crop'; }}
            />
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-semibold px-3 py-1 rounded-full">
                {bike.brand_name}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {bike.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {bike.model} Model
            </p>

            <div className="card bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg mb-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Gauge className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engine</p>
                    <p className="font-semibold">{bike.engine_CC} cc</p>
                  </div>
                </div>
                {bike.mileage && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                      <Droplet className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="font-semibold">{bike.mileage}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">City Center</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="font-semibold">4.5 / 5.0</p>
                  </div>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-6 mt-2">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-gray-500 mb-1">Rental Price</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(rentalType === 'hour' ? bike.pricePerHour : bike.price)}
                        </span>
                        <span className="text-gray-500">/{rentalType === 'hour' ? 'hour' : 'day'}</span>
                      </div>
                      
                      {bike.pricePerHour && (
                        <div className="flex gap-2 mt-2 bg-gray-100 dark:bg-dark-700 p-1 rounded-lg">
                          <button
                            onClick={() => setRentalType('hour')}
                            className={`px-4 py-1.5 text-sm rounded-md transition ${rentalType === 'hour' ? 'bg-white dark:bg-dark-600 shadow text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
                          >
                            Rent Hourly
                          </button>
                          <button
                            onClick={() => setRentalType('day')}
                            className={`px-4 py-1.5 text-sm rounded-md transition ${rentalType === 'day' ? 'bg-white dark:bg-dark-600 shadow text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
                          >
                            Rent Daily
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bike.availability ? (
                      <span className="flex items-center gap-1 text-green-600 font-semibold px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle2 className="h-5 w-5" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-semibold px-4 py-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <AlertCircle className="h-5 w-5" /> Booked
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!bike.availability || bookingLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {bookingLoading ? 'Processing...' : (bike.availability ? 'Book Now' : 'Not Available')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetail;
