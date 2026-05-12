import { motion } from 'framer-motion';
import { Brain, BarChart3, Shield, TrendingUp, Home, Bell } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Price Prediction',
    desc: 'Advanced machine learning algorithms analyze market data to predict accurate property values in real-time.',
    color: 'from-primary-500 to-primary-400',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'Comprehensive market insights with interactive charts and district-level pricing analysis.',
    color: 'from-blue-500 to-blue-400',
  },
  {
    icon: Shield,
    title: 'Fraud Detection',
    desc: 'Automatically detect unrealistic pricing with our intelligent flagging system.',
    color: 'from-green-500 to-green-400',
  },
  {
    icon: TrendingUp,
    title: 'Market Insights',
    desc: 'Stay informed with real-time market trends, price movements, and investment opportunities.',
    color: 'from-purple-500 to-purple-400',
  },
  {
    icon: Home,
    title: 'Property Management',
    desc: 'Complete listing management with AI-powered recommendations and approval workflows.',
    color: 'from-orange-500 to-orange-400',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    desc: 'Get notified about price changes, new listings, and market opportunities that match your criteria.',
    color: 'from-red-500 to-red-400',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
            <Brain className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">Powered by Advanced AI</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{' '}
            <span className="gradient-text">NyumbaSense</span>
          </h2>
          <p className="text-lg text-gray-600">Our platform combines cutting-edge AI with local market expertise to deliver accurate property valuations</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group card p-8 card-hover relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`} />
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
