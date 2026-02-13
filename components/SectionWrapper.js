import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function SectionWrapper({
  id,
  children,
  className = '',
  title,
  subtitle,
}) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id={id} className={`section-padding relative ${className}`}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              <span className="text-white">{title.split(' ')[0]} </span>
              <span className="neon-text">
                {title.split(' ').slice(1).join(' ')}
              </span>
            </h2>
            {subtitle && (
              <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                {subtitle}
              </p>
            )}
            <div className="mt-6 mx-auto w-24 neon-line" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
