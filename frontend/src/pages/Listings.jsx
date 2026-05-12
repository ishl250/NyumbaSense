import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Bed, Bath, Square, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listingsAPI } from '../services/api';
import { SkeletonCard } from '../components/Loading';

const districts = ['', 'Gasabo', 'Kicukiro', 'Nyarugenge', 'Nyanza', 'Gisagara', 'Nyaruguru', 'Huye', 'Nyamagabe', 'Ruhango', 'Muhanga', 'Kamonyi', 'Karongi', 'Rutsiro', 'Rubavu', 'Nyabihu', 'Ngororero', 'Rusizi', 'Nyamasheke', 'Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirche', 'Bugesera', 'Ngoma'];
const types = ['', 'Apartment', 'House', 'Villa', 'Mansion'];

export default function Listings() {
  const [filters, setFilters] = useState({ search: '', district: '', property_type: '', min_price: '', max_price: '', bedrooms: '' });
  const [view, setView] = useState('grid');

  const { data, isLoading } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingsAPI.getAll(filters),
  });

  const listings = data?.data?.listings || [];

  const formatPrice = (p) => {
    if (!p) return 'N/A';
    if (p >= 1000000) return `${(p / 1000000).toFixed(1)}M RWF`;
    if (p >= 1000) return `${(p / 1000).toFixed(0)}K RWF`;
    return `${p.toLocaleString()} RWF`;
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-cream py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4">Property Listings</h1>
            <p className="text-lg text-gray-600">Discover your perfect property with AI-verified valuations</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 -mt-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by location, title..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="input-field pl-12" />
              </div>
              <div className="grid grid-cols-2 lg:flex gap-3">
                <select value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })} className="input-field">
                  <option value="">All Districts</option>
                  {districts.filter(Boolean).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={filters.property_type} onChange={(e) => setFilters({ ...filters, property_type: e.target.value })} className="input-field">
                  <option value="">All Types</option>
                  {types.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })} className="input-field">
                  <option value="">Any Beds</option>
                  {[1, 2, 3, 4, 5].map((b) => <option key={b} value={b}>{b}+ Beds</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setView('grid')} className={`p-3 rounded-xl ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-400'} hover:bg-primary-50 hover:text-primary-600 transition-colors`}>
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setView('list')} className={`p-3 rounded-xl ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-400'} hover:bg-primary-50 hover:text-primary-600 transition-colors`}>
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {listings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/listings/${listing.id}`} className={`block card card-hover overflow-hidden ${view === 'list' ? 'flex' : ''}`}>
                    <div className={`bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center ${view === 'list' ? 'w-48 shrink-0' : 'h-48'}`}>
                      <Building2Icon className="w-12 h-12 text-primary-300" />
                    </div>
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{listing.title}</h3>
                        {listing.price_status === 'Fair Market Price' && <span className="badge-green shrink-0 ml-2">AI Verified</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        {listing.location}, {listing.district}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.bathrooms}</span>
                        <span className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.square_feet} sqft</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary-600">{formatPrice(listing.estimated_price || listing.seller_price)}</p>
                          {listing.estimated_price && (
                            <p className="text-xs text-gray-400">Listed: {formatPrice(listing.seller_price)}</p>
                          )}
                        </div>
                        <span className={`badge ${listing.status === 'approved' ? 'badge-green' : 'badge-yellow'}`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Building2Icon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}
