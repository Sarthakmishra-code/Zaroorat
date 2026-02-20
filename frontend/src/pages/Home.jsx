import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react';
import AnimatedVehicles from '../components/home/AnimatedVehicles';
import CitySelector from '../components/home/CitySelector';
import BikeCard from '../components/cards/BikeCard';
import CarCard from '../components/cards/CarCard';
import HostelCard from '../components/cards/HostelCard';
import Loader from '../components/common/Loader';
import vehicleService from '../services/vehicleService';

const Home = () => {
  const [bikes, setBikes] = useState([]);
  const [cars, setCars] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bikesRes, carsRes, hostelsRes] = await Promise.all([
        vehicleService.getBikes({ limit: 3 }),
        vehicleService.getCars({ limit: 3 }),
        vehicleService.getHostels({ limit: 3 }),
      ]);

      setBikes(bikesRes.data.slice(0, 3));
      setCars(carsRes.data.slice(0, 3));
      setHostels(hostelsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Journey Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Rent Bikes, Cars & Find Hostels in 8+ Cities Across India
            </p>
            <Link to="/bikes" className="btn-primary inline-flex items-center gap-2">
              Explore Now <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          {/* Animated Vehicles */}
          <AnimatedVehicles />
        </div>
      </section>

      {/* City Selector */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <CitySelector />
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: 'Verified Vehicles', desc: 'All vehicles verified and insured', color: 'text-green-500' },
              { icon: Clock, title: '24/7 Support', desc: 'Round the clock customer service', color: 'text-blue-500' },
              { icon: Shield, title: 'Secure Booking', desc: 'Safe and encrypted payments', color: 'text-purple-500' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <feature.icon className={`h-16 w-16 ${feature.color} mx-auto mb-4`} />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Featured Bikes 🏍️</h2>
          <Link to="/bikes" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {bikes.map((bike, i) => (
            <BikeCard key={bike._id} bike={bike} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="bg-gray-50 dark:bg-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Featured Cars 🚗</h2>
            <Link to="/cars" className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cars.map((car, i) => (
              <CarCard key={car._id} car={car} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hostels */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Featured Hostels 🏠</h2>
          <Link to="/hostels" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {hostels.map((hostel, i) => (
            <HostelCard key={hostel._id} hostel={hostel} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

