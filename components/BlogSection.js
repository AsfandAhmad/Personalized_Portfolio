import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import { FaCalendar, FaArrowRight } from 'react-icons/fa';

export default function BlogSection({ posts = [] }) {
  if (posts.length === 0) return null;

  return (
    <SectionWrapper
      id="blog"
      title="Blog & Articles"
      subtitle="Thoughts, tutorials, and insights from my journey"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.article
            key={post.id || i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="group glass-card rounded-xl overflow-hidden cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={post.image_url || `https://placehold.co/800x400/111111/FF073A?text=${post.title}`}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-3">
                <FaCalendar size={10} />
                <time>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-neon-red transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center gap-2 text-neon-red text-sm font-medium
                              group-hover:gap-3 transition-all duration-300">
                Read More <FaArrowRight size={12} />
              </div>
            </div>

            {/* Bottom neon line */}
            <div className="h-[2px] bg-neon-red scale-x-0 group-hover:scale-x-100
                            transition-transform duration-500 origin-left shadow-neon" />
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
