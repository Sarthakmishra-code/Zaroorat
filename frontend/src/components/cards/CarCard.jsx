import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Gauge, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const CarCard = ({ car, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card group cursor-pointer"
      onClick={() => navigate(`/cars/${car._id}`)}
    >
      {/* Image */}
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
        <img
          src={car.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Car'}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {car.availability ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Available
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Rented
          </div>
        )}
        {car.fuelType && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-dark-800/90 px-2 py-1 rounded-full text-xs font-bold">
            {car.fuelType}
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition">
          {car.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {car.brand_name} {car.model}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{car.seatingCapacity} Seats</span>
          </div>
          {car.transmission && (
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{car.transmission}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>4.7</span>
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(car.price)}
            </span>
            <span className="text-gray-500 text-sm ml-1">/day</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/cars/${car._id}`);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;

