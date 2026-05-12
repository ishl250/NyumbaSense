import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Home, BarChart3, Building2, Users, Database,
  Menu, X, LogOut, ChevronDown, Bell, Settings, TrainTrack,
} from 'lucide-react';

const navItems = {
  seller: [
    { path: '/dashboard/seller', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/seller', label: 'My Listings', icon: Building2 },
    { path: '/predict', label: 'Add Listing', icon: Home },
  ],
  buyer: [
    { path: '/dashboard/buyer', label: 'Browse', icon: Home },
    { path: '/listings', label: 'Listings', icon: Building2 },
    { path: '/predict', label: 'Predict Price', icon: BarChart3 },
  ],
  admin: [
    { path: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/admin', label: 'Analytics', icon: BarChart3 },
    { path: '/dashboard/seller', label: 'Listings', icon: Building2 },
    { path: '/dashboard/trainer', label: 'Training', icon: TrainTrack },
  ],
  trainer: [
    { path: '/dashboard/trainer', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/trainer', label: 'Datasets', icon: Database },
    { path: '/dashboard/trainer', label: 'Train Model', icon: TrainTrack },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = navItems[user?.role] || navItems.buyer;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">NyumbaSense</h2>
            <p className="text-xs text-gray-500">AI Platform</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {items.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
