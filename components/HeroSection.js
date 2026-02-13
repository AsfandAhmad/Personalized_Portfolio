import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import NeonButton from './NeonButton';
import { FaChevronDown, FaDownload, FaRocket } from 'react-icons/fa';

const Hero3DScene = dynamic(() => import('./Hero3DScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-dark-900" />
  ),
});

export default function HeroSection({ about }) {
  const name = about?.name || process.env.NEXT_PUBLIC_OWNER_NAME || 'Asfand Ahmed';
  const titles = [
    'Full Stack Developer',
    'Backend Specialist',
    'Web App Developer',
    'Tech Enthusiast',
  ];
  const [titleIndex, setTitleIndex] = useState(0);
  const tagline = about?.tagline || 'Building scalable web applications & intelligent solutions';

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Hero3DScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight">
            <span className="text-white">ASFAND </span>
            <span className="text-gradient-neon">AHMED</span>
          </h1>

          {/* Animated rotating title */}
          <div className="h-12 md:h-16 mb-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={titleIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-neon-red"
              >
                {titles[titleIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-gray-500 text-sm md:text-base mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {tagline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <NeonButton
              variant="solid"
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FaRocket className="mr-2" />
              Let&apos;s Build Together
            </NeonButton>
            <NeonButton
              variant="secondary"
              size="lg"
              href={about?.resume_url || '/assets/resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDownload className="mr-2" />
              Download Resume
            </NeonButton>
          </motion.div>

          {/* Sub tagline */}
          <motion.p
            className="text-gray-500 text-sm md:text-base mt-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {tagline}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChevronDown className="text-neon-red/50 text-xl" />
        </motion.div>
      </div>
    </section>
  );
}
