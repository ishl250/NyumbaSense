import { motion } from 'framer-motion';
import { Users, Building2, TrendingUp, AlertTriangle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { datasetAPI, authAPI, listingsAPI } from '../../services/api';
import { PageLoader } from '../../components/Loading';

export default function AdminDashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => datasetAPI.getAnalytics(),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => authAPI.getUsers(),
  });

  const { data: listingsData } = useQuery({
    queryKey: ['allListings'],
    queryFn: () => listingsAPI.getAll(),
  });

  if (analyticsLoading) return <PageLoader />;

  const stats = analytics?.data || {};
  const users = usersData?.data?.users || [];

  const statCards = [
    { label: 'Total Users', value: stats.total_users || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Listings', value: stats.total_listings || 0, icon: Building2, color: 'text-green-600 bg-green-50' },
    { label: 'Total Predictions', value: stats.total_predictions || 0, icon: TrendingUp, color: 'text-primary-600 bg-primary-50' },
    { label: 'Pending Reviews', value: stats.pending_listings || 0, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-4 lg:p-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary-500" /> Platform Analytics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                <div><p className="font-semibold text-gray-900">Avg Confidence</p><p className="text-sm text-gray-500">Across all predictions</p></div>
              </div>
              <span className="text-xl font-bold text-primary-600">{stats.avg_confidence?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>
                <div><p className="font-semibold text-gray-900">Flagged Listings</p><p className="text-sm text-gray-500">Need review</p></div>
              </div>
              <span className="text-xl font-bold text-red-600">{stats.flagged_listings || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5 text-blue-600" /></div>
                <div><p className="font-semibold text-gray-900">Avg Price</p><p className="text-sm text-gray-500">Across all listings</p></div>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.avg_price ? `${(stats.avg_price / 1000000).toFixed(0)}M RWF` : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary-500" /> Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-sm">{user.name?.charAt(0) || 'U'}</div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="badge capitalize">{user.role}</span>
              </div>
            ))}
            {users.length === 0 && <p className="text-gray-500 text-center py-4">No users yet</p>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {stats.listings_by_type && stats.listings_by_type.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Listings by Type</h3>
            <div className="space-y-3">
              {stats.listings_by_type.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 lg:w-48 bg-gray-200 rounded-full h-2">
                      <div className="gradient-bg h-2 rounded-full" style={{ width: `${(item.count / (stats.total_listings || 1)) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.listings_by_district && stats.listings_by_district.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Listings by District</h3>
            <div className="space-y-3">
              {stats.listings_by_district.map((item) => (
                <div key={item.district} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{item.district}</p>
                    <p className="text-xs text-gray-500">{item.count} properties</p>
                  </div>
                  <span className="font-semibold text-primary-600">{item.avg_price ? `${(item.avg_price / 1000000).toFixed(0)}M RWF` : 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
