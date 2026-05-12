import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-primary-50 to-cream">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-32 h-32 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/20">
          <span className="text-6xl font-extrabold text-white">?</span>
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! This page doesn't exist.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-5 h-5" /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
