import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedVehicles = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="relative h-96 overflow-hidden">
      {/* Bike from Left */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute left-0 top-1/4"
      >
        <div className="text-8xl transform hover:scale-110 transition-transform cursor-pointer">
          🏍️
        </div>
        <p className="text-center mt-2 font-bold text-blue-600 dark:text-blue-400">Bikes</p>
      </motion.div>

      {/* Car from Right */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute right-0 top-1/4"
      >
        <div className="text-8xl transform hover:scale-110 transition-transform cursor-pointer">
          🚗
        </div>
        <p className="text-center mt-2 font-bold text-green-600 dark:text-green-400">Cars</p>
      </motion.div>

      {/* Hostel in Center */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="text-9xl transform hover:scale-110 transition-transform cursor-pointer">
          🏠
        </div>
        <p className="text-center mt-2 font-bold text-purple-600 dark:text-purple-400">Hostels</p>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 left-1/4 text-4xl opacity-20"
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-20 right-1/4 text-4xl opacity-20"
      >
        ☁️
      </motion.div>
    </div>
  );
};

export default AnimatedVehicles;
