import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Gauge, Star, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import vehicleService from '../services/vehicleService';
import orderService from '../services/orderService';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getCarById(id);
      setCar(response.data);
    } catch (error) {
      toast.error('Failed to load car details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a car');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const orderData = {
        serviceType: 'car',
        serviceObjectId: car._id,
        serviceModel: 'Car',
        price: car.price,
      };

      await orderService.createOrder(orderData);
      toast.success('Car booking request sent successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place booking');
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!car) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Car Not Found</h2>
        <button onClick={() => navigate('/cars')} className="btn-primary">
          Back to Cars
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/cars')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 mb-8 transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Cars
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]"
          >
            <img
              src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&fit=crop'}
              alt={car.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&fit=crop'; }}
            />
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2">
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-semibold px-3 py-1 rounded-full">
                {car.brand_name}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {car.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {car.model} Model
            </p>

            <div className="card bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg mb-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Seating</p>
                    <p className="font-semibold">{car.seatingCapacity} Seats</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <Gauge className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-semibold">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel</p>
                    <p className="font-semibold">{car.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="font-semibold">4.7 / 5.0</p>
                  </div>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-6 mt-2">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-gray-500 mb-1">Rental Price</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(car.price)}
                      </span>
                      <span className="text-gray-500">/day</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {car.availability ? (
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
                  disabled={!car.availability || bookingLoading}
                  className="w-full btn-primary py-4 text-lg"
                >
                  {bookingLoading ? 'Processing...' : (car.availability ? 'Book Now' : 'Not Available')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
