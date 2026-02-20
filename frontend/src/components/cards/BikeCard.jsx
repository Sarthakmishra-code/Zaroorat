import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gauge, Droplet, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const BikeCard = ({ bike, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card group cursor-pointer"
      onClick={() => navigate(`/bikes/${bike._id}`)}
    >
      {/* Image */}
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
        <img
          src={bike.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Bike'}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {bike.availability ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Available
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Rented
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          {bike.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {bike.brand_name} {bike.model}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>{bike.engine_CC}cc</span>
          </div>
          {bike.mileage && (
            <div className="flex items-center gap-1">
              <Droplet className="h-4 w-4" />
              <span>{bike.mileage}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>4.5</span>
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(bike.price)}
            </span>
            <span className="text-gray-500 text-sm ml-1">/day</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/bikes/${bike._id}`);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BikeCard;

