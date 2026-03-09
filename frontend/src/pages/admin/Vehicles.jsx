import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Car as CarIcon, Bike } from 'lucide-react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Vehicles = () => {
    const [services, setServices] = useState({ cars: [], bikes: [], hostels: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cars');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchServices = async () => {
        try {
            setLoading(true);
            // Currently the backend getAllServices doesn't take pagination or search, it returns all three
            const response = await adminService.getDashboardStats(); // Temporary workaround: getDashboardStats might not have all vehicles
            // Let's create a direct api call to the vehicleService since adminService doesn't export generic getCars
            const [carsRes, bikesRes] = await Promise.all([
                fetch('http://localhost:8000/api/v1/cars').then(res => res.json()),
                fetch('http://localhost:8000/api/v1/bikes').then(res => res.json())
            ]);

            setServices({
                cars: carsRes.data || [],
                bikes: bikesRes.data || [],
                hostels: []
            });
        } catch (error) {
            toast.error('Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const deleteVehicle = async (type, id) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                await fetch(`http://localhost:8000/api/v1/${type}s/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                toast.success(`${type} deleted successfully`);
                fetchServices();
            } catch (error) {
                toast.error(`Failed to delete ${type}`);
            }
        }
    };

    const currentData = services[activeTab] || [];
    const filteredData = currentData.filter(v =>
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage the fleet of cars and bikes.</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-9 py-2 bg-white dark:bg-dark-800"
                        />
                    </div>

                    <button className="btn-primary flex items-center gap-2 py-2 shrink-0">
                        <Plus className="h-4 w-4" />
                        Add {activeTab === 'cars' ? 'Car' : 'Bike'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-dark-700 shrink-0">
                <button
                    onClick={() => { setActiveTab('cars'); setSearchTerm(''); }}
                    className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'cars'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    <CarIcon className="h-4 w-4" /> Cars
                </button>
                <button
                    onClick={() => { setActiveTab('bikes'); setSearchTerm(''); }}
                    className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'bikes'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    <Bike className="h-4 w-4" /> Bikes
                </button>
            </div>

            <div className="flex-1 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 shadow-sm overflow-hidden flex flex-col min-h-0 mt-4">
                <div className="overflow-x-auto flex-1 h-full">
                    <table className="w-full text-left relative h-full">
                        <thead className="bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-dark-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Vehicle Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Pricing</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Details</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="h-[400px]">
                                        <Loader />
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <CarIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                        No {activeTab} found in the database.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-16 bg-gray-100 dark:bg-dark-700 rounded-lg overflow-hidden shrink-0">
                                                    <img
                                                        src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&h=100&fit=crop'}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&h=100&fit=crop'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white text-base">{item.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.brand_name} {item.model}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.price)}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">per day</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] w-fit font-semibold uppercase tracking-wider ${item.availability
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {item.availability ? 'Available' : 'Rented'}
                                                </span>
                                                {item.fuelType && <span className="text-xs text-gray-500 border border-gray-200 dark:border-dark-600 px-1.5 py-0.5 rounded w-fit">{item.fuelType}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800" title="Edit">
                                                    <Edit2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteVehicle(activeTab === 'cars' ? 'car' : 'bike', item._id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Vehicles;
