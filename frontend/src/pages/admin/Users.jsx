import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Trash2, Search, CheckCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers({ search: searchTerm });
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const toggleAdminStatus = async (userId, currentStatus) => {
        try {
            await adminService.updateUserStatus(userId, { admin: !currentStatus });
            toast.success(`User is now ${!currentStatus ? 'an Admin' : 'a regular user'}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                await adminService.deleteUser(userId);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage users and approve admin requests.</p>
                </div>

                {/* Search */}
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-9 py-2 bg-white dark:bg-dark-800"
                    />
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1 h-full">
                    <table className="w-full text-left relative h-full">
                        <thead className="bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-dark-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Contact Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Admin Status</th>
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
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className={`hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors ${u.applyForAdmin && !u.admin ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                {u.fullname}
                                                {u.admin && <Shield className="h-4 w-4 text-blue-500 shrink-0" />}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">@{u.username}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white truncate max-w-[200px]" title={u.email}>{u.email}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{u.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.admin ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <CheckCircle className="h-3 w-3" /> Admin
                                                </span>
                                            ) : u.applyForAdmin ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    <ShieldAlert className="h-3 w-3" /> Requested Access
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleAdminStatus(u._id, u.admin)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${u.admin
                                                            ? 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-dark-600 dark:text-gray-300 dark:hover:bg-dark-700'
                                                            : 'border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20'
                                                        }`}
                                                >
                                                    {u.admin ? 'Revoke Admin' : 'Make Admin'}
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u._id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                                    title="Delete User"
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

export default Users;
