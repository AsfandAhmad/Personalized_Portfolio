import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import ProjectCard from './ProjectCard';

export default function ProjectsSection({ projects = [] }) {
  const allTechs = [...new Set(projects.flatMap((p) => p.technologies || []))];
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => (p.technologies || []).includes(filter));

  return (
    <SectionWrapper
      id="projects"
      title="My Projects"
      subtitle="A selection of my recent work and side projects"
    >
      {/* Filter buttons */}
      {allTechs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['All', ...allTechs.slice(0, 8)].map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 border ${
                filter === tech
                  ? 'bg-neon-red/20 text-neon-red border-neon-red shadow-neon-sm'
                  : 'bg-transparent text-gray-500 border-dark-500 hover:text-white hover:border-gray-400'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {/* Projects grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No projects found for this filter.</p>
      )}
    </SectionWrapper>
  );
}
