import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Wifi, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const HostelCard = ({ hostel, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card group cursor-pointer"
      onClick={() => navigate(`/hostels/${hostel._id}`)}
    >
      {/* Image */}
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
        <img
          src={hostel.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Hostel'}
          alt={hostel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {hostel.availability ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Available
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Full
          </div>
        )}
        {hostel.ac && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            AC
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
          {hostel.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {hostel.description || 'Comfortable hostel with all amenities'}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{hostel.roomCapacity} Person</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="h-4 w-4" />
            <span>WiFi</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>4.3</span>
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(hostel.price)}
            </span>
            <span className="text-gray-500 text-sm ml-1">/month</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hostels/${hostel._id}`);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HostelCard;
