import { motion } from 'framer-motion';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SectionWrapper from './SectionWrapper';
import { FaStar, FaBrain } from 'react-icons/fa';

const skillCategories = [
  { id: 'all', label: 'All Skills', icon: '🎯' },
  { id: 'Core', label: 'Core', icon: '⚡' },
  { id: 'AI & ML', label: 'AI & ML', icon: '🤖' },
  { id: 'Backend', label: 'Backend', icon: '🔧' },
  { id: 'Frontend', label: 'Frontend', icon: '🎨' },
  { id: 'Tools', label: 'Tools', icon: '🛠️' },
  { id: 'Leadership', label: 'Leadership', icon: '👑' },
];

function CurrentlyMastering() {
  const masteringSkills = [
    { name: 'Advanced Backend Systems', icon: '🔧', color: 'from-red-500 to-orange-500' },
    { name: 'System Design & Architecture', icon: '🏗️', color: 'from-purple-500 to-pink-500' },
    { name: 'Cloud & Deployment', icon: '☁️', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-display font-bold mb-2 flex items-center justify-center gap-3">
          <FaBrain className="text-neon-red" size={28} />
          <span className="text-white">Currently </span>
          <span className="text-gradient-neon">Mastering</span>
        </h3>
        <p className="text-gray-500 text-sm">Advanced skills in active development</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {masteringSkills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className="glass-card rounded-xl p-6 text-center relative overflow-hidden">
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="text-5xl mb-4">{skill.icon}</div>
                <h4 className="text-white font-semibold text-sm mb-2">{skill.name}</h4>
                <div className="flex items-center justify-center gap-1 text-neon-red text-xs">
                  <FaStar /><FaStar /><FaStar /><FaStar className="opacity-50" />
                </div>
              </div>

              {/* Neon border effect */}
              <div className="absolute inset-0 rounded-xl border border-neon-red/0 group-hover:border-neon-red/30 transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SkillBar({ skill, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white group-hover:text-neon-red transition-colors">
          {skill.name}
        </span>
        <span className="text-xs font-mono text-neon-red">{skill.level}%</span>
      </div>
      <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
          className="neon-progress-bar"
        />
      </div>
    </motion.div>
  );
}

function SkillCircle({ skill, index, inView }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (skill.level / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center group"
    >
      <div className="relative w-24 h-24 md:w-28 md:h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="#FF073A"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
            transition={{ duration: 1.5, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
            style={{
              filter: 'drop-shadow(0 0 6px #FF073A)',
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold font-mono text-white group-hover:text-neon-red transition-colors">
            {skill.level}%
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs md:text-sm text-gray-400 text-center font-medium group-hover:text-white transition-colors">
        {skill.name}
      </p>
    </motion.div>
  );
}

export default function SkillsSection({ skills = [] }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter skills by category
  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  // Group skills by category for display
  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <SectionWrapper
      id="skills"
      title="Skills & Expertise"
      subtitle="Technologies and tools I work with to build exceptional products"
    >
      <div ref={ref}>
        {/* Currently Mastering */}
        <CurrentlyMastering />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'bg-neon-red/20 text-neon-red border-neon-red shadow-neon-sm'
                  : 'bg-transparent text-gray-500 border-dark-500 hover:text-white hover:border-gray-400'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
        {/* Circular skills showcase (top featured) */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-16">
          {skills.slice(0, 6).map((skill, i) => (
            <SkillCircle key={skill.id || i} skill={skill} index={i} inView={inView} />
          ))}
        </div>

        {/* Bar skills by category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(categories).map(([category, catSkills]) => {
            // Only show categories that match filter
            if (activeCategory !== 'all' && category !== activeCategory) return null;
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-neon-red font-display font-semibold text-sm uppercase tracking-wider mb-6">
                  {category}
                </h3>
                <div className="space-y-4">
                  {catSkills.map((skill, i) => (
                    <SkillBar key={skill.id || i} skill={skill} index={i} inView={inView} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
