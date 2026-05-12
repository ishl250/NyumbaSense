import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Listings from '../pages/Listings';
import HouseDetails from '../pages/HouseDetails';
import PricingPrediction from '../pages/PricingPrediction';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import SellerDashboard from '../pages/dashboard/SellerDashboard';
import BuyerDashboard from '../pages/dashboard/BuyerDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import TrainerDashboard from '../pages/dashboard/TrainerDashboard';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'listings', element: <Listings /> },
      { path: 'listings/:id', element: <HouseDetails /> },
      { path: 'predict', element: <PricingPrediction /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard/seller" /> },
      { path: 'seller', element: <ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute> },
      { path: 'buyer', element: <ProtectedRoute roles={['buyer', 'admin']}><BuyerDashboard /></ProtectedRoute> },
      { path: 'admin', element: <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute> },
      { path: 'trainer', element: <ProtectedRoute roles={['trainer', 'admin']}><TrainerDashboard /></ProtectedRoute> },
    ],
  },
  { path: '*', element: <NotFound /> },
];
