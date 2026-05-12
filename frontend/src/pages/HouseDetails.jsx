import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Calendar, Car, School, TrendingUp, ArrowLeft, Heart, Share2, Building2 as Building2L, Stethoscope } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listingsAPI } from '../services/api';
import { PageLoader } from '../components/Loading';
import toast from 'react-hot-toast';

export default function HouseDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsAPI.getById(id),
  });

  if (isLoading) return <PageLoader />;
  if (!data?.data?.listing) return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900">Listing not found</h2></div>;

  const listing = data.data.listing;

  const formatPrice = (p) => {
    if (!p) return 'N/A';
    if (p >= 1000000) return `${(p / 1000000).toFixed(1)}M RWF`;
    if (p >= 1000) return `${(p / 1000).toFixed(0)}K RWF`;
    return `${p.toLocaleString()} RWF`;
  };

  const getStatusColor = (status) => {
    const map = {
      'Fair Market Price': 'text-green-600 bg-green-50',
      'Overpriced': 'text-red-600 bg-red-50',
      'Slightly Overpriced': 'text-yellow-600 bg-yellow-50',
      'Suspicious Undervaluation': 'text-orange-600 bg-orange-50',
      'Slightly Underpriced': 'text-blue-600 bg-blue-50',
    };
    return map[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-primary-50 to-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/listings" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Link>
        </div>
      </div>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
                <div className="h-64 lg:h-96 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <Building2Icon className="w-24 h-24 text-primary-300" />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{listing.title}</h1>
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <MapPin className="w-4 h-4" />
                        {listing.location}, {listing.district}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toast.success('Feature coming soon')} className="p-3 bg-gray-100 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button onClick={() => toast.success('Link copied!')} className="p-3 bg-gray-100 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">{listing.description || 'No description provided.'}</p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      { icon: Bed, label: 'Bedrooms', value: listing.bedrooms },
                      { icon: Bath, label: 'Bathrooms', value: listing.bathrooms },
                      { icon: Square, label: 'Area', value: `${listing.square_feet} sqft` },
                      { icon: Car, label: 'Parking', value: listing.parking_spaces || 0 },
                      { icon: Calendar, label: 'Year Built', value: listing.year_built || 'N/A' },
                      { icon: Building2Icon, label: 'Type', value: listing.property_type },
                      { icon: School, label: 'Nearby School', value: listing.nearby_school ? 'Yes' : 'No' },
                      { icon: Stethoscope, label: 'Nearby Hospital', value: listing.nearby_hospital ? 'Yes' : 'No' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                          <Icon className="w-5 h-5 text-primary-500 mb-2" />
                          <p className="text-xs text-gray-500">{item.label}</p>
                          <p className="font-semibold text-gray-900">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 lg:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">AI Valuation</h3>

                {listing.estimated_price ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">AI Estimated Price</p>
                      <p className="text-3xl font-extrabold gradient-text">{formatPrice(listing.estimated_price)}</p>
                    </div>

                    <div className="bg-primary-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Price Range</p>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(listing.price_range_min)} - {formatPrice(listing.price_range_max)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Confidence Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div className="gradient-bg h-3 rounded-full" style={{ width: `${listing.confidence_score || 0}%` }} />
                        </div>
                        <span className="text-sm font-bold text-primary-600">{Math.round(listing.confidence_score || 0)}%</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${getStatusColor(listing.price_status)}`}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold">{listing.price_status}</span>
                      </div>
                    </div>

                    {listing.seller_price && (
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-500">Seller's Listed Price</p>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(listing.seller_price)}</p>
                        {listing.estimated_price && (
                          <p className={`text-sm mt-1 ${listing.seller_price > listing.estimated_price ? 'text-red-500' : 'text-green-500'}`}>
                            {listing.seller_price > listing.estimated_price ? '+' : ''}
                            {(((listing.seller_price - listing.estimated_price) / listing.estimated_price) * 100).toFixed(1)}% vs AI estimate
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">AI valuation pending. Check back soon.</p>
                )}
              </motion.div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white font-bold">
                    {listing.seller_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.seller_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Building2Icon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}
