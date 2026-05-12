import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary-50 to-cream">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20">
              <span className="text-white font-bold text-xl">N</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your NyumbaSense account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input-field pl-12" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="input-field pl-12 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Signing in...' : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Create one</Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => setForm({ email: 'admin@nyumbasense.com', password: 'admin123' })} className="px-3 py-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">Admin</button>
              <button onClick={() => setForm({ email: 'seller@nyumbasense.com', password: 'seller123' })} className="px-3 py-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">Seller</button>
              <button onClick={() => setForm({ email: 'buyer@nyumbasense.com', password: 'buyer123' })} className="px-3 py-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">Buyer</button>
              <button onClick={() => setForm({ email: 'trainer@nyumbasense.com', password: 'trainer123' })} className="px-3 py-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">Trainer</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
