import { useState, useEffect } from 'react';
import { Package, Search, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            // Backend order search would be mapped here, currently only status is completely supported in the query
            const response = await adminService.getAllOrders(params);

            // Filter client-side if a search term exists (e.g. for ID or User name)
            if (searchTerm) {
                const lowerSearch = searchTerm.toLowerCase();
                const filteredOrders = response.data.orders.filter(order =>
                    order._id.toLowerCase().includes(lowerSearch) ||
                    (order.user && order.user.fullname.toLowerCase().includes(lowerSearch))
                );
                setOrders(filteredOrders);
            } else {
                setOrders(response.data.orders);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await adminService.updateOrderStatus(orderId, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">View and update customer rental orders.</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field py-2 bg-white dark:bg-dark-800 w-32 sm:w-auto px-4 !pr-10"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-9 py-2 bg-white dark:bg-dark-800"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1 h-full">
                    <table className="w-full text-left relative h-full">
                        <thead className="bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-dark-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Order Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Customer</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Amount</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right whitespace-nowrap">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="h-[400px]">
                                        <Loader />
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <Package className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded inline-block mb-1">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                {order.serviceType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.fullname || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{order.user?.email || ''}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(order.price)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                <select
                                                    className="input-field py-1.5 px-3 text-sm bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-600 !pr-8 w-[130px] shadow-sm"
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
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

export default Orders;
