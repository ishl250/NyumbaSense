import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-cream">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-200/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-primary-100 mb-6">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">AI-Powered Property Valuation</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Intelligent Property Valuation for{' '}
              <span className="gradient-text">Africa</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              Know the true market value of any property in Rwanda. Our AI analyzes thousands of data points to provide accurate, transparent, and fair price estimates.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary text-base inline-flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/predict" className="btn-secondary text-base">
                Try Price Prediction
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
              {[
                { icon: Shield, label: 'Trusted', desc: 'Verified Valuations' },
                { icon: TrendingUp, label: 'Accurate', desc: '94% Precision' },
                { icon: Sparkles, label: 'Smart', desc: 'AI Powered' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400/20 to-primary-600/20 rounded-3xl blur-3xl" />
              <div className="relative glass-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">AI Dashboard</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Estimated Price</p>
                    <p className="text-lg font-bold text-primary-600">RWF 85M</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+2.4%</span>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Confidence</p>
                    <p className="text-lg font-bold text-green-600">94%</p>
                    <div className="w-full bg-green-200 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price Range</span>
                    <span className="font-semibold text-gray-900">RWF 79M - 91M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="badge-green">Fair Market Price</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Property Details</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white rounded-lg p-2"><span className="block font-semibold text-gray-900">3</span>Beds</div>
                    <div className="bg-white rounded-lg p-2"><span className="block font-semibold text-gray-900">2</span>Baths</div>
                    <div className="bg-white rounded-lg p-2"><span className="block font-semibold text-gray-900">1,200</span>Sq Ft</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 gradient-bg rounded-2xl -z-10 opacity-50 blur-xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-100 rounded-full -z-10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
