/**
 * Fallback / demo data used when Supabase is not configured.
 * Replace these with your own details or configure Supabase to make them dynamic.
 */

export const fallbackAbout = {
  name: 'Asfand Ahmed',
  title: 'Full-Stack Developer',
  tagline: 'Building scalable web applications & intelligent solutions',
  bio: `I'm a Computer Science student at FAST NUCES with a strong focus on backend development 
        and AI-powered solutions. From interning at Apexes AI to building production-ready systems 
        for text analysis, recommendation engines, and automation workflows, I specialize in designing 
        scalable, high-performance applications. Passionate about leveraging AI to solve real-world 
        problems, I combine technical expertise with a visionary mindset to turn complex ideas into 
        elegant solutions. Always learning, always building.`,
  photo_url: '/assets/profile.jpg',
  resume_url: '/assets/resume.pdf',
};

export const fallbackSkills = [
  { id: 1, name: 'Python', category: 'Core', level: 95, order: 1 },
  { id: 2, name: 'JavaScript / TypeScript', category: 'Core', level: 92, order: 2 },
  { id: 3, name: 'C++', category: 'Core', level: 85, order: 3 },
  { id: 4, name: 'AI / Machine Learning', category: 'AI & ML', level: 20, order: 4 },
  { id: 5, name: 'Node.js / Express', category: 'Backend', level: 90, order: 5 },
  { id: 6, name: 'Django / FastAPI', category: 'Backend', level: 88, order: 6 },
  { id: 7, name: 'PostgreSQL / MongoDB', category: 'Backend', level: 87, order: 7 },
  { id: 8, name: 'Supabase / Firebase', category: 'Backend', level: 90, order: 8 },
  { id: 9, name: 'React / Next.js', category: 'Frontend', level: 93, order: 9 },
  { id: 10, name: 'Three.js / WebGL', category: 'Frontend', level: 75, order: 10 },
  { id: 11, name: 'TailwindCSS', category: 'Frontend', level: 95, order: 11 },
  { id: 12, name: 'Git / GitHub Actions', category: 'Tools', level: 90, order: 12 },
  { id: 13, name: 'Linux / Bash', category: 'Tools', level: 82, order: 13 },
  { id: 14, name: 'Project Management', category: 'Leadership', level: 88, order: 14 },
  { id: 15, name: 'Team Leadership', category: 'Leadership', level: 85, order: 15 },
];

export const fallbackProjects = [
  {
    id: 1,
    title: 'Apexes AI',
    description: 'Contributed as an intern to an AI-powered SaaS platform providing automation solutions for businesses. Worked on backend APIs, frontend features, and testing.',
    image_url: 'https://placehold.co/600x400/111111/FF073A?text=Apexes+AI',
    live_url: '#',
    github_url: '#',
    technologies: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
    featured: true,
    impact: 'Contributed to platform serving businesses with automation solutions',
    learnings: 'Learned SaaS architecture, API development, and working in a professional team',
    order: 1,
  },
  {
    id: 2,
    title: 'LMS Platform',
    description: 'A comprehensive Learning Management System with real-time course delivery, student analytics, assignment management, and content recommendations.',
    image_url: 'https://placehold.co/600x400/111111/FF073A?text=LMS+Platform',
    live_url: '#',
    github_url: '#',
    technologies: ['Next.js', 'Node.js', 'Supabase', 'TailwindCSS', 'WebSocket'],
    featured: true,
    impact: 'Used by 500+ students with real-time collaboration features',
    learnings: 'Mastered real-time systems, role-based access control, and educational UX design',
    order: 2,
  },
  {
    id: 3,
    title: 'DevOrbit',
    description: 'A developer collaboration platform connecting developers worldwide with project matching, code reviews, and team management tools.',
    image_url: 'https://placehold.co/600x400/111111/FF073A?text=DevOrbit',
    live_url: '#',
    github_url: '#',
    technologies: ['React', 'Django', 'PostgreSQL', 'Redis'],
    featured: true,
    impact: 'Built a developer community platform with project-developer matching',
    learnings: 'Deep experience with social platform architecture and community building',
    order: 3,
  },
  {
    id: 4,
    title: 'Steam Game Recommender',
    description: 'Recommendation engine for Steam games using collaborative filtering, content-based analysis, and hybrid approaches with high accuracy.',
    image_url: 'https://placehold.co/600x400/111111/FF073A?text=Game+Recommender',
    live_url: '#',
    github_url: '#',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Flask'],
    featured: false,
    impact: 'High recommendation accuracy on Steam dataset with 50K+ games',
    learnings: 'Collaborative filtering, feature engineering, and model optimization',
    order: 4,
  },
  {
    id: 5,
    title: 'AI Chatbot Platform',
    description: 'Conversational chatbot platform with multi-domain support, context awareness, and seamless human-agent handoff capabilities.',
    image_url: 'https://placehold.co/600x400/111111/FF073A?text=AI+Chatbot',
    live_url: '#',
    github_url: '#',
    technologies: ['Python', 'OpenAI API', 'FastAPI', 'Next.js'],
    featured: false,
    impact: 'Handles conversations with high user satisfaction rate',
    learnings: 'Prompt engineering, conversation state management, and API integration',
    order: 5,
  },
  {
    id: 6,
    title: 'Portfolio Website',
    description: 'This portfolio with 3D graphics, neon aesthetics, AI chatbot, full admin panel, and Supabase-powered dynamic content.',
    image_url: 'https://placehold.co/600x400/111111/FF073A?text=Portfolio',
    live_url: '#',
    github_url: '#',
    technologies: ['Next.js', 'Three.js', 'Supabase', 'TailwindCSS'],
    featured: false,
    impact: 'Showcase of full-stack capabilities with 3D web technologies and dynamic CMS',
    learnings: '3D web development, advanced animations, and building complete applications',
    order: 6,
  },
];

export const fallbackExperience = [
  {
    id: 1,
    title: 'Software Engineering Intern',
    company: 'Apexes AI',
    description: 'Working as an intern contributing to an AI automation platform. Helping build backend APIs, frontend features, and assisting with testing and documentation.',
    start_date: '2025-08',
    end_date: null,
    current: true,
    order: 1,
  },
  {
    id: 2,
    title: 'Full-Stack Developer',
    company: 'Freelance & Personal Projects',
    description: 'Built 30+ personal and academic projects, gaining deep experience in Next.js, Python backends, and full-stack development. Also collaborated with 2–3 clients, applying professional workflows and delivering real-world solutions.',
    start_date: '2025-08',
    end_date: null,
    current: true,
    order: 2,
  },
];

export const fallbackCertifications = [
  { id: 1, title: 'Intro to Programming', issuer: 'Kaggle', date: '2026', url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/intro-to-programming', badge: '📊', order: 1 },
  { id: 2, title: 'Python', issuer: 'Kaggle', date: '2026', url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/python', badge: '🐍', order: 2 },
  { id: 3, title: 'Intro to Machine Learning', issuer: 'Kaggle', date: '2026', url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/intro-to-machine-learning', badge: '🤖', order: 3 },
  { id: 4, title: 'Ethical Hacking', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/e8d930dc4822216e63310086e8536df0', badge: '🛡️', order: 4 },
  { id: 5, title: 'MERN Stack with Redux & React', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/8e1da5cc040cf65f35f92367c12a6ec1', badge: '⚛️', order: 5 },
  { id: 6, title: 'WordPress', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/c8a0801a3949f5bb1cab654aa1eec51b', badge: '🌐', order: 6 },
  { id: 7, title: 'Microsoft Azure Intro', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/78ac96f89199ae7e3daaec4821ff9f22', badge: '☁️', order: 7 },
];

export const fallbackBlogPosts = [];

// Chatbot knowledge base for rule-based responses
export const chatbotKnowledge = {
  greetings: [
    "Hey there! 👋 I'm Asfand's AI Assistant. I can help you learn about Asfand's work or start a project discussion!",
    "Hello! Welcome to Asfand Ahmed's portfolio. What can I help you with?",
    "Hi! Ask me about projects, skills, or type 'hire' to start a project discussion!",
  ],
  skills: "Asfand is proficient in Python, JavaScript/TypeScript, React/Next.js, Django/FastAPI, PostgreSQL, Supabase, and more. His strongest area is full-stack web development with 6+ months of professional experience.",
  projects: "Key projects include: **Apexes AI** (intern), **LMS Platform** (learning management system), **DevOrbit** (developer collaboration), **Steam Game Recommender**, and **AI Chatbot Platform**. Check the Projects section for details!",
  experience: "Asfand is a Software Engineering Intern at Apexes AI, a freelance Full-Stack Developer with 30+ projects, and a CS student at FAST NUCES.",
  contact: "You can reach Asfand via the contact form, LinkedIn, GitHub, Kaggle, or WhatsApp. Type 'project' to start a project discussion right here!",
  availability: "Asfand is open to exciting projects, especially in full-stack development. Type 'hire' or 'project' to start a discussion!",
  tech_stack: "This portfolio was built with Next.js, Three.js, TailwindCSS, Framer Motion, and Supabase. It features 3D graphics, AI chatbot, and a fully dynamic admin panel.",
  education: "Asfand is pursuing a BS in Computer Science at FAST NUCES (National University), currently in his 3rd year. He's focused on Software Engineering, AI & Machine Learning.",
  fallback: [
    "Interesting question! You can ask about skills, projects, experience, or type 'hire' to start a project discussion.",
    "I'm not sure about that. Try asking about Asfand's skills, projects, or education. Or use the contact form to reach out!",
    "Great question! For a detailed discussion, type 'project' to start a project inquiry.",
  ],
};
