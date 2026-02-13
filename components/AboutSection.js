import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper from './SectionWrapper';
import { FaDownload } from 'react-icons/fa';
import NeonButton from './NeonButton';

export default function AboutSection({ about }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const name = about?.name || 'Asfand Ahmed';
  const bio = about?.bio || 'A passionate developer building amazing digital experiences.';
  const photoUrl = about?.photo_url || '/assets/profile.jpg';
  const resumeUrl = about?.resume_url || '/assets/resume.pdf';

  return (
    <SectionWrapper
      id="about"
      title="About Me"
      subtitle="Get to know who I am and what drives me"
    >
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative mx-auto lg:mx-0"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Neon frame */}
            <div className="absolute inset-0 rounded-2xl neon-border rotate-3 transition-transform hover:rotate-0 duration-500" />
            <div className="absolute inset-0 rounded-2xl border border-white/10 -rotate-3 transition-transform hover:rotate-0 duration-500" />

            {/* Photo container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-neon-red/30">
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x400/111111/FF073A?text=${name.charAt(0)}`;
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-neon-red/20 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="text-white">I&apos;m </span>
            <span className="neon-text">{name}</span>
          </h3>
          <p className="text-neon-red/80 font-mono text-sm mb-6">
            {about?.title || 'Full-Stack Developer'}
          </p>
          <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base">
            {bio}
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: '6 Mo+', label: 'Experience' },
              { value: '30+', label: 'Projects' },
              { value: '3+', label: 'Clients' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card rounded-lg p-4 text-center"
              >
                <div className="text-2xl md:text-3xl font-display font-bold neon-text">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <NeonButton
            variant="primary"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDownload className="mr-2" />
            Download Resume
          </NeonButton>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
