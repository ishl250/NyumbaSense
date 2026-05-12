import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'David Mugisha',
    role: 'Real Estate Agent',
    company: 'Prime Properties Rwanda',
    content: 'NyumbaSense AI has transformed how I price properties. The AI predictions are remarkably accurate and my clients trust the data-driven approach completely.',
    rating: 5,
    avatar: 'DM',
    color: 'from-primary-500 to-primary-400',
  },
  {
    name: 'Grace Uwimana',
    role: 'Home Buyer',
    company: 'First-Time Buyer',
    content: 'As a first-time home buyer, I was worried about overpaying. NyumbaSense gave me the confidence to make a fair offer. The price prediction feature is a game-changer.',
    rating: 5,
    avatar: 'GU',
    color: 'from-blue-500 to-blue-400',
  },
  {
    name: 'Patrick Bizimana',
    role: 'Property Seller',
    company: 'Bizimana Estates',
    content: 'I listed my property at a fair price thanks to NyumbaSense. It sold within a week! The platform helped me avoid the common mistake of overpricing.',
    rating: 5,
    avatar: 'PB',
    color: 'from-green-500 to-green-400',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">Trusted by real estate professionals across Rwanda</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-100" />
              <div className={`w-14 h-14 bg-gradient-to-br ${t.color} rounded-2xl flex items-center justify-center mb-4`}>
                <span className="text-white font-bold text-lg">{t.avatar}</span>
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{t.content}</p>
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role} at {t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
