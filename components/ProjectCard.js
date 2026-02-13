import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FaExternalLinkAlt, FaGithub, FaArrowRight } from 'react-icons/fa';

export default function ProjectCard({ project, index }) {
  const router = useRouter();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on external links
    if (e.target.closest('a')) return;
    router.push(`/project/${project.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative glass-card rounded-xl overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={project.image_url || `https://placehold.co/600x400/111111/FF073A?text=${project.title}`}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent
                        opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Links overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {project.live_url && project.live_url !== '#' && (
            <motion.a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-neon-red/20 border border-neon-red flex items-center justify-center
                         text-neon-red hover:bg-neon-red hover:text-white transition-all duration-300 shadow-neon-sm"
            >
              <FaExternalLinkAlt size={16} />
            </motion.a>
          )}
          {project.github_url && project.github_url !== '#' && (
            <motion.a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center
                         text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <FaGithub size={18} />
            </motion.a>
          )}
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-neon-red/20 border border-neon-red/50
                          text-neon-red text-[10px] font-mono uppercase tracking-wider">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white group-hover:text-neon-red transition-colors mb-2">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.technologies || []).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md
                         bg-neon-red/5 text-neon-red/80 border border-neon-red/20
                         group-hover:border-neon-red/40 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* View Details button */}
        <div className="flex items-center gap-2 text-neon-red text-sm font-medium group-hover:gap-3 transition-all duration-300">
          View Details <FaArrowRight size={12} />
        </div>
      </div>

      {/* Bottom neon line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-red scale-x-0 group-hover:scale-x-100
                      transition-transform duration-500 origin-left shadow-neon" />
    </motion.div>
  );
}
