import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingBag, Car, Menu, X, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Vehicles', path: '/admin/vehicles', icon: Car },
    ];

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '280px' : '0px',
                    opacity: isSidebarOpen ? 1 : 0
                }}
                className={`fixed lg:sticky top-0 h-screen z-30 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 overflow-hidden flex flex-col transition-all duration-300 ${!isSidebarOpen && 'lg:w-[80px] lg:opacity-100'}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700 h-16">
                    {(isSidebarOpen || window.innerWidth >= 1024) && (
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate flex items-center gap-2">
                            <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-blue-500 flex-shrink-0" />
                            {isSidebarOpen && "Zaroorat Admin"}
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900/50'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                                }`}
                            title={!isSidebarOpen ? item.name : ''}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {(isSidebarOpen) && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 flex items-center px-4 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 mr-4"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex-1"></div>
                    {/* Add User Profile Dropdown or other topbar items here later */}
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
