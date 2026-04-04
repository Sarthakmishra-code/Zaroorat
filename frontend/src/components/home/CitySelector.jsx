import { motion } from 'framer-motion';
import { MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CITIES = [
  {
    name: 'Greater Noida',
    image: 'https://www.commercialnoida.com/assets/upload/blog/2a9501d921746aa3aa37377cfaff7580.webp?w=400&h=300&fit=crop',
    description: 'The Planned City'
  },
  {
    name: 'Knowledge Park',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    description: 'Education Hub'
  },
  {
    name: 'Pari Chowk',
    image: 'https://img.hexahome.in/media/blogs/hexahome-blogs/pari-chowk-metro-station/pc02.webp',
    description: 'The Central Connect'
  },
  {
    name: 'Alpha 1',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
    description: 'Prime Commercial'
  },
  {
    name: 'Beta 2',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop',
    description: 'Peaceful Residential'
  },
  {
    name: 'Noida',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    description: 'IT & Business Hub'
  },
  {
    name: 'Greater Noida West',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    description: 'Noida Extension'
  },
  {
    name: 'New Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
    description: 'The Capital'
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

