import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import CarCard from '../components/cards/CarCard';
import Loader from '../components/common/Loader';
import vehicleService from '../services/vehicleService';
import toast from 'react-hot-toast';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    seatingCapacity: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    availability: 'true',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.seatingCapacity) params.seatingCapacity = filters.seatingCapacity;
      if (filters.fuelType) params.fuelType = filters.fuelType;
      if (filters.transmission) params.transmission = filters.transmission;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.availability) params.availability = filters.availability;

      const response = await vehicleService.getCars(params);
      setCars(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch cars');
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
    fetchCars();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      seatingCapacity: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      availability: 'true',
    });
    fetchCars();
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
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🚗 Rent Cars
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find the perfect car for your journey
          </p>
        </motion.div>

        {/* Filters */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <select name="seatingCapacity" value={filters.seatingCapacity} onChange={handleFilterChange} className="input-field">
                <option value="">All Seats</option>
                <option value="4">4 Seater</option>
                <option value="5">5 Seater</option>
                <option value="7">7 Seater</option>
              </select>
              <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange} className="input-field">
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className="input-field">
                <option value="">All Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" className="input-field" />
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" className="input-field" />
              <select name="availability" value={filters.availability} onChange={handleFilterChange} className="input-field">
                <option value="">All Status</option>
                <option value="true">Available</option>
                <option value="false">Rented</option>
              </select>
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
        {cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 dark:text-gray-400">No cars found</p>
            <button onClick={clearFilters} className="btn-primary mt-4">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Showing {cars.length} car(s)</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car, index) => (
                <CarCard key={car._id} car={car} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cars;

