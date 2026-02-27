import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import HostelCard from '../components/cards/HostelCard';
import Loader from '../components/common/Loader';
import vehicleService from '../services/vehicleService';
import toast from 'react-hot-toast';

const Hostels = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ac: '',
    minCapacity: '',
    minPrice: '',
    maxPrice: '',
    availability: 'true',
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.ac) params.ac = filters.ac;
      if (filters.minCapacity) params.minCapacity = filters.minCapacity;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.availability) params.availability = filters.availability;

      const response = await vehicleService.getHostels(params);
      setHostels(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch hostels');
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
    fetchHostels();
  };

  const clearFilters = () => {
    setFilters({
      ac: '',
      minCapacity: '',
      minPrice: '',
      maxPrice: '',
      availability: 'true',
    });
    fetchHostels();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🏠 Find Hostels
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Comfortable and affordable stays
          </p>
        </motion.div>

        {/* Filters */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <select name="ac" value={filters.ac} onChange={handleFilterChange} className="input-field">
                <option value="">AC/Non-AC</option>
                <option value="true">AC</option>
                <option value="false">Non-AC</option>
              </select>
              <input type="number" name="minCapacity" value={filters.minCapacity} onChange={handleFilterChange} placeholder="Min Capacity" className="input-field" />
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" className="input-field" />
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" className="input-field" />
            </div>

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
        {hostels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 dark:text-gray-400">No hostels found</p>
            <button onClick={clearFilters} className="btn-primary mt-4">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Showing {hostels.length} hostel(s)</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel, index) => (
                <HostelCard key={hostel._id} hostel={hostel} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Hostels;