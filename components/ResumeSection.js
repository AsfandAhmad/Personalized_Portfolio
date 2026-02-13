import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper from './SectionWrapper';
import NeonButton from './NeonButton';
import { FaBriefcase, FaDownload, FaGraduationCap, FaUniversity } from 'react-icons/fa';

function TimelineItem({ item, index, inView, isLast }) {
  const isLeft = index % 2 === 0;
  const startDate = item.start_date ? new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
  const endDate = item.current ? 'Present' : item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  return (
    <div className={`flex items-start gap-4 md:gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className={`flex-1 glass-card rounded-xl p-6 group hover:border-neon-red/50 transition-all duration-300 ${
          isLeft ? 'md:text-right' : ''
        }`}
      >
        {/* Date badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red text-xs font-mono mb-3 ${
          isLeft ? 'md:float-right md:ml-3' : ''
        }`}>
          {startDate} — {endDate}
        </div>

        <div className="clear-both">
          <h3 className="text-lg font-bold text-white group-hover:text-neon-red transition-colors">
            {item.title}
          </h3>
          <p className="text-neon-red/70 text-sm font-medium mb-3">{item.company}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
        </div>

        {item.current && (
          <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neon-red/20 text-neon-red text-[10px] font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse" />
            Current
          </div>
        )}
      </motion.div>

      {/* Timeline connector */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.15 }}
          className="w-4 h-4 rounded-full bg-neon-red border-2 border-dark-900 shadow-neon-sm z-10"
        />
        {!isLast && (
          <div className="w-0.5 h-full bg-gradient-to-b from-neon-red/50 to-transparent min-h-[80px]" />
        )}
      </div>

      {/* Spacer for the other side */}
      <div className="hidden md:block flex-1" />
    </div>
  );
}

export default function ResumeSection({ experience = [], resumeUrl }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <SectionWrapper
      id="resume"
      title="Experience & Education"
      subtitle="My professional journey and academic background"
    >
      <div ref={ref}>
        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-display font-bold mb-8 flex items-center justify-center gap-3">
            <FaGraduationCap className="text-neon-red" size={28} />
            <span className="text-white">Education</span>
          </h3>
          
          <div className="max-w-3xl mx-auto glass-card rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-neon-red/10 border-2 border-neon-red/30 flex items-center justify-center flex-shrink-0">
                <FaUniversity className="text-neon-red" size={28} />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">Bachelor of Science in Computer Science</h4>
                <p className="text-neon-red font-semibold mb-2">FAST NUCES (National University)</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>3rd Year (In Progress)</span>
                  <span>•</span>
                  <span>Expected 2027</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Focused on Software Engineering, AI & Machine Learning, and Full-Stack Development.
                  Active member of technical societies and hackathon organizer.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <h3 className="text-2xl font-display font-bold mb-12 flex items-center justify-center gap-3">
          <FaBriefcase className="text-neon-red" size={24} />
          <span className="text-white">Professional Experience</span>
        </h3>

        {/* Timeline */}
        <div className="relative space-y-8 md:space-y-12">
          {/* Central vertical line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-red/30 via-neon-red/10 to-transparent -translate-x-1/2" />

          {experience.map((item, i) => (
            <TimelineItem
              key={item.id || i}
              item={item}
              index={i}
              inView={inView}
              isLast={i === experience.length - 1}
            />
          ))}
        </div>

        {/* Download Resume CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <NeonButton
            variant="solid"
            size="lg"
            href={resumeUrl || '/assets/resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDownload className="mr-2" />
            Download Full Resume
          </NeonButton>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
