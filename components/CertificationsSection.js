import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper from './SectionWrapper';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';

const certifications = [
  {
    title: 'Intro to Programming',
    issuer: 'Kaggle',
    date: '2026',
    url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/intro-to-programming',
    badge: '📊',
  },
  {
    title: 'Python',
    issuer: 'Kaggle',
    date: '2026',
    url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/python',
    badge: '🐍',
  },
  {
    title: 'Intro to Machine Learning',
    issuer: 'Kaggle',
    date: '2026',
    url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/intro-to-machine-learning',
    badge: '🤖',
  },
  {
    title: 'Ethical Hacking',
    issuer: 'Coursera',
    date: '2026',
    url: 'https://coursera.org/share/e8d930dc4822216e63310086e8536df0',
    badge: '🛡️',
  },
  {
    title: 'MERN Stack with Redux & React',
    issuer: 'Coursera',
    date: '2026',
    url: 'https://coursera.org/share/8e1da5cc040cf65f35f92367c12a6ec1',
    badge: '⚛️',
  },
  {
    title: 'WordPress',
    issuer: 'Coursera',
    date: '2026',
    url: 'https://coursera.org/share/c8a0801a3949f5bb1cab654aa1eec51b',
    badge: '🌐',
  },
  {
    title: 'Microsoft Azure Intro',
    issuer: 'Coursera',
    date: '2026',
    url: 'https://coursera.org/share/78ac96f89199ae7e3daaec4821ff9f22',
    badge: '☁️',
  },
];

const defaultCertifications = certifications;

export default function CertificationsSection({ certifications: propCerts }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const certs = propCerts?.length ? propCerts : defaultCertifications;

  if (certs.length === 0) return null;

  return (
    <SectionWrapper
      id="certifications"
      title="Certifications"
      subtitle="Professional certifications and achievements"
    >
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert, i) => (
            <motion.a
              key={cert.title}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-xl p-6 group hover:border-neon-red/50 transition-all duration-300 block"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-neon-red/10 border-2 border-neon-red/30 flex items-center justify-center flex-shrink-0 group-hover:border-neon-red/50 transition-colors">
                  <span className="text-2xl">{cert.badge}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1 group-hover:text-neon-red transition-colors flex items-center gap-2">
                    {cert.title}
                    <FaExternalLinkAlt className="text-gray-600 group-hover:text-neon-red text-xs" />
                  </h3>
                  <p className="text-neon-red/70 text-sm font-medium mb-1">{cert.issuer}</p>
                  <p className="text-gray-500 text-xs">{cert.date}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>


      </div>
    </SectionWrapper>
  );
}
