import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Building2, Brain, Target, Users } from 'lucide-react';

function Counter({ end, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} className="text-4xl lg:text-5xl font-extrabold gradient-text">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

const stats = [
  { icon: Building2, end: 1500, suffix: '+', label: 'Houses Listed', desc: 'Properties in our database' },
  { icon: Brain, end: 5000, suffix: '+', label: 'Predictions Generated', desc: 'AI valuations completed' },
  { icon: Target, end: 94, suffix: '%', label: 'Accuracy', desc: 'Precision rate' },
  { icon: Users, end: 1200, suffix: '+', label: 'Active Users', desc: 'Trusted by professionals' },
];

export default function StatsSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <Counter end={stat.end} suffix={stat.suffix} />
                <p className="text-lg font-semibold text-gray-900 mt-2">{stat.label}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
