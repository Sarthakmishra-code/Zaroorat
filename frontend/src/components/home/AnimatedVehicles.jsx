import { motion } from 'framer-motion';

const AnimatedVehicles = () => {
  const categories = [
    {
      title: 'Bikes',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&h=300&fit=crop',
      color: 'from-blue-900/80',
      delay: 0.2
    },
    {
      title: 'Hostels',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&h=300&fit=crop',
      color: 'from-purple-900/80',
      delay: 0.4,
      featured: true
    },
    {
      title: 'Cars',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=300&fit=crop',
      color: 'from-green-900/80',
      delay: 0.6
    }
  ];

  return (
    <div className="relative mt-16 mb-12">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        {categories.map((item) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: item.delay, ease: "easeOut" }}
            className={`relative group ${item.featured ? 'z-10 md:-mt-8' : 'z-0'}`}
          >
            <div
              className={`
                rounded-2xl overflow-hidden shadow-2xl transition-all duration-300
                ${item.featured ? 'w-64 h-64 md:w-72 md:h-72 ring-4 ring-white/20' : 'w-48 h-48 md:w-56 md:h-56'}
                hover:-translate-y-2 hover:shadow-xl cursor-pointer
              `}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} to-transparent flex items-end p-6`}>
                <p className={`text-white font-bold ${item.featured ? 'text-3xl' : 'text-xl'}`}>
                  {item.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative Clouds */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 left-10 md:left-1/4 text-6xl opacity-10 dark:opacity-5 pointer-events-none"
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-4 right-10 md:right-1/4 text-5xl opacity-10 dark:opacity-5 pointer-events-none"
      >
        ☁️
      </motion.div>
    </div>
  );
};

export default AnimatedVehicles;
