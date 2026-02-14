import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendar, FaLightbulb } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NeonButton from '@/components/NeonButton';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { fallbackProjects } from '@/lib/fallbackData';

export default function ProjectDetail({ project }) {
  const router = useRouter();

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-dark-900 pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-neon-red transition-colors"
            >
              <FaArrowLeft />
              <span className="text-sm">Back to Projects</span>
            </button>
          </motion.div>

          {/* Project header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
              <span className="text-white">{project.title.split(' ')[0]} </span>
              <span className="text-gradient-neon">
                {project.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            {project.created_at && (
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
                <FaCalendar size={14} />
                <time>{new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</time>
              </div>
            )}

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Links */}
            <div className="flex flex-wrap gap-4 mb-12">
              {project.live_url && project.live_url !== '#' && (
                <NeonButton
                  variant="solid"
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt className="mr-2" size={14} />
                  Live Demo
                </NeonButton>
              )}
              {project.github_url && project.github_url !== '#' && (
                <NeonButton
                  variant="secondary"
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="mr-2" size={16} />
                  View Source
                </NeonButton>
              )}
            </div>
          </motion.div>

          {/* Project image */}
          {project.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-2xl overflow-hidden border border-neon-red/20 shadow-2xl"
            >
              <div className="relative w-full h-96">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Tech Stack */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                  <span className="text-white">Tech </span>
                  <span className="text-neon-red">Stack</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(project.technologies || []).map((tech) => (
                    <div
                      key={tech}
                      className="px-4 py-2 glass-card rounded-lg text-sm font-mono text-gray-300 border border-neon-red/20 hover:border-neon-red/50 transition-colors"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Impact & Learnings */}
              {project.impact && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-xl p-8"
                >
                  <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                    <FaLightbulb className="text-neon-red" />
                    <span className="text-white">Impact & </span>
                    <span className="text-neon-red">Learnings</span>
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-400 leading-relaxed">{project.impact}</p>
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Project Info</h3>
                <div className="space-y-4 text-sm">
                  {project.featured && (
                    <div>
                      <p className="text-gray-600 mb-1">Status</p>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/20 text-neon-red text-xs border border-neon-red/30">
                        Featured Project
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 mb-1">Technologies</p>
                    <p className="text-gray-300">{(project.technologies || []).length} technologies</p>
                  </div>
                </div>
              </motion.div>

              {/* More Projects CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-xl p-6 text-center"
              >
                <p className="text-gray-400 text-sm mb-4">Interested in seeing more?</p>
                <NeonButton
                  variant="primary"
                  onClick={() => router.push('/#projects')}
                  className="w-full"
                >
                  View All Projects
                </NeonButton>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  let project = null;

  if (isSupabaseConfigured()) {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    project = data;
  }

  // Fallback to demo data
  if (!project) {
    project = fallbackProjects.find((p) => p.id === parseInt(id)) || null;
  }

  return {
    props: { project },
  };
}
