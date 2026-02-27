import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Shield, Search, Calendar, MapPin, List } from 'lucide-react';
import CitySelector from '../components/home/CitySelector';
import BikeCard from '../components/cards/BikeCard';
import CarCard from '../components/cards/CarCard';
import HostelCard from '../components/cards/HostelCard';
import Loader from '../components/common/Loader';
import vehicleService from '../services/vehicleService';

const Home = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [cars, setCars] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchService, setSearchService] = useState('bikes');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');

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

  const handleSearchClick = () => {
    // Navigate to the selected service page
    // Optional: Pass location and dates as URL query parameters so the target page can pre-filter
    const queryParams = new URLSearchParams();
    if (searchLocation) queryParams.append('location', searchLocation);
    if (pickupDate) queryParams.append('pickupDate', pickupDate);
    if (dropoffDate) queryParams.append('dropoffDate', dropoffDate);

    navigate(`/${searchService}?${queryParams.toString()}`);
  };

  // Removed the full screen loader so the Hero section always loads instantly

  return (
    <div className="min-h-screen">
      {/* Professional Hero Section with Search Bar */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80"
            alt="Person driving on scenic road"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-[-10vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-white"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Perfect Ride</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light drop-shadow-md max-w-3xl mx-auto">
              Premium bikes, cars, and stays across 8+ cities in India. Book instantly with Zaroorat.
            </p>
          </motion.div>

          {/* Semantic Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-2 md:p-4 flex flex-col md:flex-row gap-4 items-center"
          >
            {/* Service Selection */}
            <div className="flex-1 flex items-center w-full bg-gray-50 dark:bg-dark-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <List className="text-gray-400 mr-3 h-5 w-5" />
              <select
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 cursor-pointer appearance-none"
              >
                <option value="bikes">Bikes</option>
                <option value="cars">Cars</option>
                <option value="hostels">Hostels</option>
              </select>
            </div>

            {/* Location Input */}
            <div className="flex-1 flex items-center w-full bg-gray-50 dark:bg-dark-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <MapPin className="text-gray-400 mr-3 h-5 w-5" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500"
              />
            </div>

            {/* Dates Input */}
            <div className="flex-1 flex items-center w-full bg-gray-50 dark:bg-dark-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Calendar className="text-gray-400 mr-3 h-5 w-5" />
              <div className="flex items-center w-full gap-2">
                <input
                  type="text"
                  placeholder="Pickup"
                  className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 text-sm"
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
                <span className="text-gray-300">|</span>
                <input
                  type="text"
                  placeholder="Dropoff"
                  className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 text-sm"
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </motion.div>
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
          {loading ? (
            <div className="col-span-3 flex justify-center py-12"><Loader /></div>
          ) : (
            bikes.map((bike, i) => (
              <BikeCard key={bike._id} bike={bike} index={i} />
            ))
          )}
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
            {loading ? (
              <div className="col-span-3 flex justify-center py-12"><Loader /></div>
            ) : (
              cars.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))
            )}
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
          {loading ? (
            <div className="col-span-3 flex justify-center py-12"><Loader /></div>
          ) : (
            hostels.map((hostel, i) => (
              <HostelCard key={hostel._id} hostel={hostel} index={i} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

