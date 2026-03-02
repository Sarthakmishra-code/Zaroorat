import { motion } from 'framer-motion';
import { MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CITIES = [
  {
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb7957ef9?w=400&h=300&fit=crop',
    description: 'Financial Capital'
  },
  {
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
    description: 'Heart of India'
  },
  {
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop',
    description: 'Silicon Valley'
  },
  {
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1603262110679-cc9bc042a4ce?w=400&h=300&fit=crop',
    description: 'City of Pearls'
  },
  {
    name: 'Chennai',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop',
    description: 'Gateway to South'
  },
  {
    name: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop',
    description: 'City of Joy'
  },
  {
    name: 'Pune',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&h=300&fit=crop',
    description: 'Oxford of East'
  },
  {
    name: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop',
    description: 'Pink City'
  },
];

const CitySelector = () => {
  const { selectedCity, setSelectedCity } = useCart();

  return (
    <div className="py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
          Choose Your City
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select from 8+ cities across India
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-4 max-w-7xl">
        {CITIES.map((city, index) => (
          <motion.button
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCity(city.name)}
            className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ${
              selectedCity === city.name
                ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-dark-900'
                : 'hover:shadow-2xl'
            }`}
          >
            {/* City Image */}
            <div className="relative h-48">
              <img
                src={city.image}
                alt={city.name}
                className="object-cover w-full h-full"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* City Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="mb-1 text-xl font-bold">{city.name}</h3>
                <p className="text-sm text-gray-200">{city.description}</p>
              </div>

              {/* Selected Badge */}
              {selectedCity === city.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute p-2 text-white bg-blue-500 rounded-full shadow-lg top-3 right-3"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}

              {/* Location Icon */}
              <div className="absolute p-2 rounded-full top-3 left-3 bg-white/90 dark:bg-dark-800/90">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;

