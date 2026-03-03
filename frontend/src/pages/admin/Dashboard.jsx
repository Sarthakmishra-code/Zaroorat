import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { Users, ShoppingBag, Car, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm flex items-center gap-4">
        <div className={`p-4 rounded-xl ${colorClass}`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminService.getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen />;
    if (!stats) return <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">Failed to load dashboard statistics.</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.stats.totalUsers || 0}
                    icon={Users}
                    colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.stats.totalOrders || 0}
                    icon={ShoppingBag}
                    colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                />
                <StatCard
                    title="Total Vehicles"
                    value={stats.stats.totalServices || 0}
                    icon={Car}
                    colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.stats.totalRevenue || 0)}
                    icon={TrendingUp}
                    colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Price</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                                {stats.recentOrders?.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {order.user?.fullname || 'Unknown User'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {formatCurrency(order.price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${order.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      `}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {!stats.recentOrders?.length && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                            <ShoppingBag className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                                            No recent orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
