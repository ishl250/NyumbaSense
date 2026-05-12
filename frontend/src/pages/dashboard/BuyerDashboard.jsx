import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Square, Search, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listingsAPI, predictionsAPI } from '../../services/api';
import { PageLoader } from '../../components/Loading';

export default function BuyerDashboard() {
  const [search, setSearch] = useState('');

  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => listingsAPI.getAll({}),
  });

  const { data: favData } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => listingsAPI.getFavorites(),
  });

  const { data: predData } = useQuery({
    queryKey: ['predictionHistory'],
    queryFn: () => predictionsAPI.getHistory(),
  });

  const listings = listingsData?.data?.listings || [];
  const favorites = favData?.data?.listings || [];
  const predictions = predData?.data?.predictions || [];

  const filtered = search ? listings.filter((l) => l.title?.toLowerCase().includes(search.toLowerCase()) || l.location?.toLowerCase().includes(search.toLowerCase())) : listings;

  const formatPrice = (p) => { if (!p) return 'N/A'; if (p >= 1000000) return `${(p / 1000000).toFixed(1)}M RWF`; if (p >= 1000) return `${(p / 1000).toFixed(0)}K RWF`; return `${p.toLocaleString()} RWF`; };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-500 mt-1">Browse properties and track your favorites</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Properties', value: listings.length, icon: Building2, color: 'text-blue-600 bg-blue-50' },
          { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-red-600 bg-red-50' },
          { label: 'Predictions', value: predictions.length, icon: Search, color: 'text-primary-600 bg-primary-50' },
          { label: 'Active Listings', value: listings.filter((l) => l.status === 'approved').length, icon: Building2, color: 'text-green-600 bg-green-50' },
        ].map((stat) => {
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

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" />
      </div>

      {favorites.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-red-500" /> Your Favorites</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.slice(0, 3).map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`} className="card p-5 card-hover block">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" /> {listing.location}, {listing.district}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.bathrooms}</span>
                  <span className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.square_feet} sqft</span>
                </div>
                <p className="text-lg font-bold text-primary-600">{formatPrice(listing.estimated_price || listing.seller_price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Properties</h2>
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, 9).map((listing, i) => (
              <motion.div key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/listings/${listing.id}`} className="card p-5 card-hover block">
                  <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-primary-300" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" /> {listing.location}, {listing.district}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{listing.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.bathrooms}</span>
                    <span className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.square_feet} sqft</span>
                  </div>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(listing.estimated_price || listing.seller_price)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
