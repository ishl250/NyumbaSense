import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To bring transparency and trust to African real estate markets through the power of artificial intelligence and data-driven insights.' },
  { icon: Eye, title: 'Our Vision', desc: 'To become the most trusted property valuation platform in Africa, empowering millions of property transactions with accurate AI predictions.' },
  { icon: Heart, title: 'Our Values', desc: 'Integrity, innovation, and inclusion. We believe in fair property pricing that benefits both buyers and sellers across the continent.' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-cream py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              About <span className="gradient-text">NyumbaSense AI</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Founded in Kigali, Rwanda, NyumbaSense AI is on a mission to revolutionize real estate valuation across Africa using cutting-edge artificial intelligence technology.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-8 text-center card-hover">
                  <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{v.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              NyumbaSense AI was born from a simple observation: the real estate market in Rwanda, and across Africa, suffers from a lack of pricing transparency. Sellers often overprice their properties, while buyers struggle to determine fair market value.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              Leveraging the power of machine learning and years of property transaction data, we built a platform that provides accurate, unbiased, and fair property valuations. Our AI considers dozens of factors including location, property features, amenities, and market trends to deliver precise price estimates.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Today, NyumbaSense AI is trusted by real estate agents, property developers, buyers, and sellers across Rwanda. We are committed to expanding our coverage and continuously improving our AI models to better serve the African real estate market.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
