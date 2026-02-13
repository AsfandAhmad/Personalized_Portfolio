import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaHeart, FaChartBar } from 'react-icons/fa';

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/AsfandAhmad', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/asfand-ahmed-91b210278/', label: 'LinkedIn' },
  { icon: FaChartBar, href: 'https://www.kaggle.com/asfandahmed098765', label: 'Kaggle' },
  { icon: FaWhatsapp, href: 'https://wa.me/923123513049', label: 'WhatsApp' },
  { icon: FaEnvelope, href: 'mailto:mrasfandahmed@gmail.com', label: 'Email' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-neon-red/20 bg-dark-800/50">
      {/* Neon line at top */}
      <div className="neon-line w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">
              <span className="neon-text">ASFAND</span>
              <span className="text-white ml-2">AHMED</span>
              <span className="text-neon-red/60 ml-2 text-sm font-mono">PORTFOLIO</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Building digital experiences with modern technologies.
              Let&apos;s create something amazing together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-neon-red font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['About', 'Skills', 'Projects', 'Resume', 'Certifications', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-500 hover:text-white text-sm transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-neon-red font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg border border-dark-500 flex items-center justify-center
                             text-gray-500 hover:text-neon-red hover:border-neon-red/50
                             hover:shadow-neon-sm transition-all duration-300"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-dark-600 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <p>
            © {currentYear} All rights reserved.
          </p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <FaHeart className="text-neon-red text-xs" /> and lots of coffee
          </p>
        </div>

        {/* Hidden admin link */}
        <div className="mt-4 text-center">
          <Link
            href="/admin"
            className="text-dark-600 hover:text-gray-500 text-[10px] transition-colors duration-300 select-none"
            aria-label="Admin"
          >
            ·
          </Link>
        </div>
      </div>
    </footer>
  );
}
