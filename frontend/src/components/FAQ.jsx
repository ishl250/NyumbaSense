import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How does NyumbaSense AI predict property prices?',
    a: 'Our AI uses advanced machine learning algorithms trained on thousands of property transactions in Rwanda. It analyzes factors like location, size, amenities, and recent market trends to generate accurate price predictions.',
  },
  {
    q: 'How accurate are the price predictions?',
    a: 'Our model achieves over 94% accuracy in price prediction. The system continuously improves as more data becomes available, with regular retraining to adapt to market changes.',
  },
  {
    q: 'Is the platform free to use?',
    a: 'We offer free basic price predictions. Premium features including detailed analytics, bulk listings, and API access are available for real estate professionals through our subscription plans.',
  },
  {
    q: 'How do I list my property?',
    a: 'Simply create an account as a seller, enter your property details, and our AI will instantly generate a fair market price estimate. You can then publish your listing for potential buyers.',
  },
  {
    q: 'What areas does NyumbaSense cover?',
    a: 'Currently, we cover all districts of Kigali including Gasabo, Kicukiro, and Nyarugenge. We are actively expanding to cover more cities across Rwanda and East Africa.',
  },
  {
    q: 'How is data privacy handled?',
    a: 'We take data privacy seriously. All user data is encrypted, and we follow strict data protection regulations. Your personal information is never shared without your consent.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">Everything you need to know about NyumbaSense AI</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-base font-semibold text-gray-900 pr-4">{faq.q}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${openIndex === i ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                  {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
