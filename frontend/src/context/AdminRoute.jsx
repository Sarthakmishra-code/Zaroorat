import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loader from '../components/common/Loader';

export const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loader fullScreen />;

    if (!user || !user.admin) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};
