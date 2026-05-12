import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, TrendingUp, Eye, Trash2, Edit3, MapPin, Bed, Bath, Square, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingsAPI } from '../../services/api';
import { PageLoader } from '../../components/Loading';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Nyanza', 'Gisagara', 'Nyaruguru', 'Huye', 'Nyamagabe', 'Ruhango', 'Muhanga', 'Kamonyi', 'Karongi', 'Rutsiro', 'Rubavu', 'Nyabihu', 'Ngororero', 'Rusizi', 'Nyamasheke', 'Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirche', 'Bugesera', 'Ngoma'];
const propertyTypes = ['Apartment', 'House', 'Villa', 'Mansion'];

export default function SellerDashboard() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', location: '', district: '', bedrooms: '3', bathrooms: '2',
    square_feet: '1200', parking_spaces: '1', year_built: '2020', property_type: 'Apartment',
    furnished: false, nearby_school: false, nearby_hospital: false, seller_price: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['myListings'],
    queryFn: () => listingsAPI.getMyListings(),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => listingsAPI.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      toast.success('Listing created successfully!');
      setShowForm(false);
      setForm({ title: '', description: '', location: '', district: '', bedrooms: '3', bathrooms: '2', square_feet: '1200', parking_spaces: '1', year_built: '2020', property_type: 'Apartment', furnished: false, nearby_school: false, nearby_hospital: false, seller_price: '' });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to create listing'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => listingsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      toast.success('Listing deleted');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to delete'),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      bedrooms: parseInt(form.bedrooms), bathrooms: parseInt(form.bathrooms),
      square_feet: parseFloat(form.square_feet), parking_spaces: parseInt(form.parking_spaces),
      year_built: parseInt(form.year_built), seller_price: parseFloat(form.seller_price),
    });
  };

  const listings = data?.data?.listings || [];
  const formatPrice = (p) => { if (!p) return 'N/A'; if (p >= 1000000) return `${(p / 1000000).toFixed(1)}M RWF`; if (p >= 1000) return `${(p / 1000).toFixed(0)}K RWF`; return `${p.toLocaleString()} RWF`; };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your property listings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> {showForm ? 'Cancel' : 'Add Listing'}
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">New Property Listing</h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" placeholder="e.g. Modern Apartment in Kacyiru" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seller Price (RWF)</label>
                <input type="number" value={form.seller_price} onChange={(e) => setForm({ ...form, seller_price: e.target.value })} required className="input-field" placeholder="e.g. 85000000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Describe your property..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="input-field" placeholder="e.g. Kacyiru" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required className="input-field">
                  <option value="">Select district</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input type="number" min={0} value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input type="number" min={0} value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sq. Feet</label>
                <input type="number" min={0} value={form.square_feet} onChange={(e) => setForm({ ...form, square_feet: e.target.value })} required className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
                <input type="number" min={0} value={form.parking_spaces} onChange={(e) => setForm({ ...form, parking_spaces: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                <input type="number" min={1900} value={form.year_built} onChange={(e) => setForm({ ...form, year_built: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} required className="input-field">
                  {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'furnished', label: 'Furnished' },
                { key: 'nearby_school', label: 'Nearby School' },
                { key: 'nearby_hospital', label: 'Nearby Hospital' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-primary-50 transition-colors">
                  <input type="checkbox" checked={form[item.key]} onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })} className="w-4 h-4 text-primary-500 rounded" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
              {createMutation.isPending ? 'Creating...' : <><Plus className="w-5 h-5" /> Create Listing</>}
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Listings', value: listings.length, icon: Building2, color: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: listings.filter((l) => l.status === 'approved').length, icon: Eye, color: 'text-green-600 bg-green-50' },
          { label: 'Pending', value: listings.filter((l) => l.status === 'pending').length, icon: TrendingUp, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Flagged', value: listings.filter((l) => l.is_flagged).length, icon: DollarSign, color: 'text-red-600 bg-red-50' },
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

      {listings.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-500 mb-4">Create your first property listing to get started</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Your First Listing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing, i) => (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6 flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-10 h-10 text-primary-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/listings/${listing.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600">{listing.title}</Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" /> {listing.location}, {listing.district}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className={`badge ${listing.status === 'approved' ? 'badge-green' : listing.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>{listing.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.bathrooms}</span>
                  <span className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.square_feet} sqft</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Your Price</p>
                      <p className="font-semibold text-gray-900">{formatPrice(listing.seller_price)}</p>
                    </div>
                    {listing.estimated_price && (
                      <div className="pl-4 border-l border-gray-200">
                        <p className="text-sm text-gray-500">AI Estimate</p>
                        <p className="font-semibold text-primary-600">{formatPrice(listing.estimated_price)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteMutation.mutate(listing.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
