import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import BikeCard from '../components/cards/BikeCard';
import Loader from '../components/common/Loader';
import vehicleService from '../services/vehicleService';
import toast from 'react-hot-toast';

const Bikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand_name: '',
    minPrice: '',
    maxPrice: '',
    availability: 'true',
  });

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.brand_name) params.brand_name = filters.brand_name;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.availability) params.availability = filters.availability;

      const response = await vehicleService.getBikes(params);
      setBikes(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch bikes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBikes();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand_name: '',
      minPrice: '',
      maxPrice: '',
      availability: 'true',
    });
    fetchBikes();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🏍️ Rent Bikes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose from our wide range of bikes
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search bikes by name or brand..."
                className="input-field pl-10"
              />
            </div>

            {/* Filter Options */}
            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="text"
                name="brand_name"
                value={filters.brand_name}
                onChange={handleFilterChange}
                placeholder="Brand (e.g., Royal Enfield)"
                className="input-field"
              />
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="input-field"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="input-field"
              />
              <select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="true">Available</option>
                <option value="false">Rented</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Apply Filters
              </button>
              <button type="button" onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {bikes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 dark:text-gray-400">No bikes found</p>
            <button onClick={clearFilters} className="btn-primary mt-4">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Showing {bikes.length} bike(s)
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bikes.map((bike, index) => (
                <BikeCard key={bike._id} bike={bike} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bikes;
