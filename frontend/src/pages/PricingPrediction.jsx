import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { predictionsAPI } from '../services/api';
import toast from 'react-hot-toast';

const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Nyanza', 'Gisagara', 'Nyaruguru', 'Huye', 'Nyamagabe', 'Ruhango', 'Muhanga', 'Kamonyi', 'Karongi', 'Rutsiro', 'Rubavu', 'Nyabihu', 'Ngororero', 'Rusizi', 'Nyamasheke', 'Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirche', 'Bugesera', 'Ngoma'];
const propertyTypes = ['Apartment', 'House', 'Villa', 'Mansion'];

export default function PricingPrediction() {
  const [form, setForm] = useState({
    location: '', district: '', bedrooms: '3', bathrooms: '2', square_feet: '1200',
    parking_spaces: '1', year_built: '2020', property_type: 'Apartment',
    furnished: false, nearby_school: false, nearby_hospital: false, seller_price: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await predictionsAPI.predict({
        ...form,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        square_feet: parseFloat(form.square_feet),
        parking_spaces: parseInt(form.parking_spaces),
        year_built: parseInt(form.year_built),
        seller_price: parseFloat(form.seller_price) || 0,
      });
      setResult(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed. Train the model first.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (p) => {
    if (!p) return '0';
    if (p >= 1000000) return `${(p / 1000000).toFixed(1)}M RWF`;
    if (p >= 1000) return `${(p / 1000).toFixed(0)}K RWF`;
    return `${p.toLocaleString()} RWF`;
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-cream py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-primary-100 mb-4">
              <Brain className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">AI Price Predictor</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Predict Property Price
            </h1>
            <p className="text-lg text-gray-600">Enter property details to get an instant AI-powered market valuation</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="card p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Property Details</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input type="text" placeholder="e.g. Kacyiru" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                      <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required className="input-field">
                        <option value="">Select district</option>
                        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
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

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
                      <input type="number" min={0} value={form.parking_spaces} onChange={(e) => setForm({ ...form, parking_spaces: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                      <input type="number" min={1900} max={2026} value={form.year_built} onChange={(e) => setForm({ ...form, year_built: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} required className="input-field">
                        {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Expected Price (Optional)</label>
                    <input type="number" min={0} placeholder="e.g. 85000000" value={form.seller_price} onChange={(e) => setForm({ ...form, seller_price: e.target.value })} className="input-field" />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { key: 'furnished', label: 'Furnished' },
                      { key: 'nearby_school', label: 'Nearby School' },
                      { key: 'nearby_hospital', label: 'Nearby Hospital' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-primary-50 transition-colors">
                        <input type="checkbox" checked={form[item.key]} onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })} className="w-4 h-4 text-primary-500 rounded focus:ring-primary-400" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 text-base py-4">
                    {loading ? (
                      <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> Analyzing...</>
                    ) : (
                      <><Brain className="w-5 h-5" /> Predict Price</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {result ? (
                <div className="space-y-6">
                  <div className="card p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">AI Valuation Result</h3>
                        <p className="text-sm text-gray-500">Based on market analysis</p>
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <p className="text-sm text-gray-500 mb-1">Estimated Market Price</p>
                      <p className="text-4xl lg:text-5xl font-extrabold gradient-text">{formatPrice(result.predicted_price)}</p>
                    </div>

                    <div className="bg-primary-50 rounded-xl p-6 mb-6">
                      <p className="text-sm text-gray-600 mb-2">Price Range (95% Confidence)</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{formatPrice(result.min_range)}</span>
                        <span className="text-gray-400">—</span>
                        <span className="font-semibold text-gray-900">{formatPrice(result.max_range)}</span>
                      </div>
                      <div className="relative mt-4 h-2 bg-primary-200 rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ left: `${(result.min_range / result.max_range) * 50}%`, right: `${(1 - result.max_range / result.max_range) * 50}%` }} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Confidence Score</span>
                          <span className="text-sm font-bold text-primary-600">{Math.round(result.confidence)}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div className="gradient-bg h-3 rounded-full" style={{ width: `${result.confidence}%` }} />
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl flex items-center gap-3 ${result.status === 'Fair Market Price' ? 'bg-green-50' : result.status === 'Overpriced' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                        {result.status === 'Fair Market Price' ? <CheckCircle className="w-6 h-6 text-green-600" /> : result.status === 'Overpriced' ? <AlertTriangle className="w-6 h-6 text-red-600" /> : <Info className="w-6 h-6 text-yellow-600" />}
                        <div>
                          <p className="font-semibold text-gray-900">{result.status}</p>
                          {result.price_difference && (
                            <p className="text-sm text-gray-500">
                              {result.seller_price > result.predicted_price ? 'Over' : 'Under'} by {formatPrice(Math.abs(result.price_difference))}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                    <ul className="space-y-3">
                      {result.status === 'Fair Market Price' && (
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                          Your pricing aligns with market data. Proceed with listing.
                        </li>
                      )}
                      {result.status === 'Overpriced' && (
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                          Consider lowering your price by at least {formatPrice(Math.abs(result.price_difference))} to match market expectations.
                        </li>
                      )}
                      {result.status === 'Suspicious Undervaluation' && (
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                          This price is significantly below market. Verify the listing details.
                        </li>
                      )}
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <TrendingUp className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                        Properties in {form.district || 'your area'} with similar features typically sell within {formatPrice(result.min_range)} and {formatPrice(result.max_range)}.
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/20">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready for AI Analysis</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Fill in the property details on the left and click "Predict Price" to get an instant AI-powered market valuation.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm mx-auto">
                    {[`${districts.length}+ Districts`, '94% Accuracy', 'Instant Results'].map((text) => (
                      <div key={text} className="bg-primary-50 rounded-xl p-3">
                        <p className="text-xs font-medium text-primary-600">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
