import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import ContactForm from './ContactForm';
import { FaEnvelope, FaWhatsapp, FaGithub, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

const contactLinks = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'mrasfandahmed@gmail.com',
    href: 'mailto:mrasfandahmed@gmail.com',
    color: 'hover:text-red-400',
  },
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: '+92 312 3513049',
    href: 'https://wa.me/923123513049',
    color: 'hover:text-green-400',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    value: 'Connect on LinkedIn',
    href: 'https://www.linkedin.com/in/asfand-ahmed-91b210278/',
    color: 'hover:text-blue-400',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    value: 'AsfandAhmad',
    href: 'https://github.com/AsfandAhmad',
    color: 'hover:text-gray-300',
  },
];

export default function ContactSection() {
  return (
    <SectionWrapper
      id="contact"
      title="Get In Touch"
      subtitle="Have a project in mind? Let's work together to bring your ideas to life."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left side - info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Let&apos;s Talk</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision. Feel free to reach out!
            </p>
          </div>

          <div className="space-y-4">
            {contactLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 group p-3 rounded-lg hover:bg-dark-700 transition-all duration-300 ${link.color}`}
              >
                <div className="w-10 h-10 rounded-lg bg-dark-600 border border-dark-500 flex items-center justify-center
                                group-hover:border-neon-red/50 group-hover:shadow-neon-sm transition-all duration-300">
                  <link.icon className="text-gray-500 group-hover:text-neon-red transition-colors" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">{link.label}</p>
                  <p className="text-sm text-gray-400 group-hover:text-white transition-colors">{link.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-700/50">
            <FaMapMarkerAlt className="text-neon-red mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Location</p>
              <p className="text-sm text-gray-400">Available Worldwide (Remote)</p>
            </div>
          </div>
        </div>

        {/* Right side - form */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-xl p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
