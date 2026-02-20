import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CITIES } from '../../utils/constants';

const CitySelector = () => {
  const { selectedCity, setSelectedCity } = useCart();

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your City</h2>
        <p className="text-gray-600 dark:text-gray-400">Select from 8+ cities across India</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {CITIES.map((city, index) => (
          <motion.button
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCity(city.name)}
            className={`p-6 rounded-2xl transition-all ${
              selectedCity === city.name
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl'
                : 'glass-card hover:shadow-lg'
            }`}
          >
            <div className="text-4xl mb-2">{city.icon}</div>
            <h3 className="font-bold text-lg">{city.name}</h3>
            {selectedCity === city.name && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2"
              >
                <MapPin className="h-5 w-5 mx-auto" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;
