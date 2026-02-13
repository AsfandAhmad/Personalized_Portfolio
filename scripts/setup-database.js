/**
 * Supabase Database Setup Script
 * Run once to create all necessary tables and seed with initial data.
 * Usage: node scripts/setup-database.js
 */

const SUPABASE_URL = 'https://viglxfgxaqtlgfzfkqwf.supabase.co';
// Use service role key from environment for seeding (do NOT hardcode secrets)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function supabaseRequest(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation',
      ...options.headers,
    },
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, ok: res.ok };
}

// ─── Test Connection ─────────────────────────────────────────────────────────
async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (res.ok) {
    console.log('✅ Connected to Supabase successfully!');
    return true;
  } else {
    console.error('❌ Connection failed:', res.status, await res.text());
    return false;
  }
}

// ─── Seed Data ───────────────────────────────────────────────────────────────
async function seedAbout() {
  console.log('📝 Seeding about...');
  const { status, data } = await supabaseRequest('about?select=id', { method: 'GET' });
  if (status === 200 && Array.isArray(data) && data.length > 0) {
    console.log('   About already has data, skipping.');
    return;
  }
  const result = await supabaseRequest('about', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Asfand Ahmed',
      title: 'Full-Stack Developer',
      tagline: 'Building scalable web applications & intelligent solutions',
      bio: "I'm a Computer Science student at FAST NUCES with a deep passion for building scalable full-stack applications and solving real-world problems with code. From interning at Apexes AI to developing LMS platforms and recommendation engines, I specialize in turning complex problems into elegant, production-ready solutions. Always learning, always building.",
      photo_url: '/assets/profile.jpg',
      resume_url: '/assets/resume.pdf',
    }),
  });
  console.log(`   About: ${result.ok ? '✅' : '❌'} (${result.status})`);
  if (!result.ok) console.log('   ', JSON.stringify(result.data));
}

async function seedSkills() {
  console.log('🔧 Seeding skills...');
  const { status, data } = await supabaseRequest('skills?select=id', { method: 'GET' });
  if (status === 200 && Array.isArray(data) && data.length > 0) {
    console.log('   Skills already has data, skipping.');
    return;
  }
  const skills = [
    { name: 'Python', category: 'Core', level: 95, "order": 1 },
    { name: 'JavaScript / TypeScript', category: 'Core', level: 92, "order": 2 },
    { name: 'C++', category: 'Core', level: 85, "order": 3 },
    { name: 'AI / Machine Learning', category: 'AI & ML', level: 20, "order": 4 },
    { name: 'Node.js / Express', category: 'Backend', level: 90, "order": 5 },
    { name: 'Django / FastAPI', category: 'Backend', level: 88, "order": 6 },
    { name: 'PostgreSQL / MongoDB', category: 'Backend', level: 87, "order": 7 },
    { name: 'Supabase / Firebase', category: 'Backend', level: 90, "order": 8 },
    { name: 'React / Next.js', category: 'Frontend', level: 93, "order": 9 },
    { name: 'Three.js / WebGL', category: 'Frontend', level: 75, "order": 10 },
    { name: 'TailwindCSS', category: 'Frontend', level: 95, "order": 11 },
    { name: 'Git / GitHub Actions', category: 'Tools', level: 90, "order": 12 },
    { name: 'Linux / Bash', category: 'Tools', level: 82, "order": 13 },
    { name: 'Project Management', category: 'Leadership', level: 88, "order": 14 },
    { name: 'Team Leadership', category: 'Leadership', level: 85, "order": 15 },
  ];
  const result = await supabaseRequest('skills', {
    method: 'POST',
    body: JSON.stringify(skills),
  });
  console.log(`   Skills: ${result.ok ? '✅' : '❌'} (${result.status})`);
  if (!result.ok) console.log('   ', JSON.stringify(result.data));
}

async function seedProjects() {
  console.log('🚀 Seeding projects...');
  const { status, data } = await supabaseRequest('projects?select=id', { method: 'GET' });
  if (status === 200 && Array.isArray(data) && data.length > 0) {
    console.log('   Projects already has data, skipping.');
    return;
  }
  const projects = [
    {
      title: 'Apexes AI',
      description: 'Contributed as an intern to an AI-powered SaaS platform providing automation solutions for businesses. Worked on backend APIs, frontend features, and testing.',
      image_url: 'https://placehold.co/600x400/111111/FF073A?text=Apexes+AI',
      live_url: '#',
      github_url: '#',
      technologies: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
      featured: true,
      impact: 'Contributed to platform serving businesses with automation solutions',
      learnings: 'Learned SaaS architecture, API development, and working in a professional team',
      "order": 1,
    },
    {
      title: 'LMS Platform',
      description: 'A comprehensive Learning Management System with real-time course delivery, student analytics, assignment management, and content recommendations.',
      image_url: 'https://placehold.co/600x400/111111/FF073A?text=LMS+Platform',
      live_url: '#',
      github_url: '#',
      technologies: ['Next.js', 'Node.js', 'Supabase', 'TailwindCSS', 'WebSocket'],
      featured: true,
      impact: 'Used by 500+ students with real-time collaboration features',
      learnings: 'Mastered real-time systems, role-based access control, and educational UX design',
      "order": 2,
    },
    {
      title: 'DevOrbit',
      description: 'A developer collaboration platform connecting developers worldwide with project matching, code reviews, and team management tools.',
      image_url: 'https://placehold.co/600x400/111111/FF073A?text=DevOrbit',
      live_url: '#',
      github_url: '#',
      technologies: ['React', 'Django', 'PostgreSQL', 'Redis'],
      featured: true,
      impact: 'Built a developer community platform with project-developer matching',
      learnings: 'Deep experience with social platform architecture and community building',
      "order": 3,
    },
    {
      title: 'Steam Game Recommender',
      description: 'Recommendation engine for Steam games using collaborative filtering, content-based analysis, and hybrid approaches with high accuracy.',
      image_url: 'https://placehold.co/600x400/111111/FF073A?text=Game+Recommender',
      live_url: '#',
      github_url: '#',
      technologies: ['Python', 'Scikit-learn', 'Pandas', 'Flask'],
      featured: false,
      impact: 'High recommendation accuracy on Steam dataset with 50K+ games',
      learnings: 'Collaborative filtering, feature engineering, and model optimization',
      "order": 4,
    },
    {
      title: 'AI Chatbot Platform',
      description: 'Conversational chatbot platform with multi-domain support, context awareness, and seamless human-agent handoff capabilities.',
      image_url: 'https://placehold.co/600x400/111111/FF073A?text=AI+Chatbot',
      live_url: '#',
      github_url: '#',
      technologies: ['Python', 'OpenAI API', 'FastAPI', 'Next.js'],
      featured: false,
      impact: 'Handles conversations with high user satisfaction rate',
      learnings: 'Prompt engineering, conversation state management, and API integration',
      "order": 5,
    },
    {
      title: 'Portfolio Website',
      description: 'This portfolio with 3D graphics, neon aesthetics, AI chatbot, full admin panel, and Supabase-powered dynamic content.',
      image_url: 'https://placehold.co/600x400/111111/FF073A?text=Portfolio',
      live_url: '#',
      github_url: '#',
      technologies: ['Next.js', 'Three.js', 'Supabase', 'TailwindCSS'],
      featured: false,
      impact: 'Showcase of full-stack capabilities with 3D web technologies and dynamic CMS',
      learnings: '3D web development, advanced animations, and building complete applications',
      "order": 6,
    },
  ];
  const result = await supabaseRequest('projects', {
    method: 'POST',
    body: JSON.stringify(projects),
  });
  console.log(`   Projects: ${result.ok ? '✅' : '❌'} (${result.status})`);
  if (!result.ok) console.log('   ', JSON.stringify(result.data));
}

async function seedExperience() {
  console.log('💼 Seeding experience...');
  const { status, data } = await supabaseRequest('experience?select=id', { method: 'GET' });
  if (status === 200 && Array.isArray(data) && data.length > 0) {
    console.log('   Experience already has data, skipping.');
    return;
  }
  const experience = [
    {
      title: 'Software Engineering Intern',
      company: 'Apexes AI',
      description: 'Working as an intern contributing to an AI automation platform. Helping build backend APIs, frontend features, and assisting with testing and documentation.',
      start_date: '2025-08-01',
      end_date: null,
      current: true,
      "order": 1,
    },
    {
      title: 'Full-Stack Developer',
      company: 'Freelance & Contract Work',
      description: 'Built 30+ web applications and projects. Specialized in Next.js, Python backends, and full-stack development. Working with 2-3 active clients.',
      start_date: '2025-08-01',
      end_date: null,
      current: true,
      "order": 2,
    },
  ];
  const result = await supabaseRequest('experience', {
    method: 'POST',
    body: JSON.stringify(experience),
  });
  console.log(`   Experience: ${result.ok ? '✅' : '❌'} (${result.status})`);
  if (!result.ok) console.log('   ', JSON.stringify(result.data));
}

async function seedCertifications() {
  console.log('🏅 Seeding certifications...');
  const { status, data } = await supabaseRequest('certifications?select=id', { method: 'GET' });
  if (status === 200 && Array.isArray(data) && data.length > 0) {
    console.log('   Certifications already has data, skipping.');
    return;
  }
  const certs = [
    { title: 'Intro to Programming', issuer: 'Kaggle', date: '2026', url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/intro-to-programming', badge: '📊', "order": 1 },
    { title: 'Python', issuer: 'Kaggle', date: '2026', url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/python', badge: '🐍', "order": 2 },
    { title: 'Intro to Machine Learning', issuer: 'Kaggle', date: '2026', url: 'https://www.kaggle.com/learn/certification/asfandahmed098765/intro-to-machine-learning', badge: '🤖', "order": 3 },
    { title: 'Ethical Hacking', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/e8d930dc4822216e63310086e8536df0', badge: '🛡️', "order": 4 },
    { title: 'MERN Stack with Redux & React', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/8e1da5cc040cf65f35f92367c12a6ec1', badge: '⚛️', "order": 5 },
    { title: 'WordPress', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/c8a0801a3949f5bb1cab654aa1eec51b', badge: '🌐', "order": 6 },
    { title: 'Microsoft Azure Intro', issuer: 'Coursera', date: '2026', url: 'https://coursera.org/share/78ac96f89199ae7e3daaec4821ff9f22', badge: '☁️', "order": 7 },
  ];
  const result = await supabaseRequest('certifications', {
    method: 'POST',
    body: JSON.stringify(certs),
  });
  console.log(`   Certifications: ${result.ok ? '✅' : '❌'} (${result.status})`);
  if (!result.ok) console.log('   ', JSON.stringify(result.data));
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Supabase Database Setup & Seed Script');
  console.log('═══════════════════════════════════════════\n');

  const connected = await testConnection();
  if (!connected) {
    console.log('\n⚠️  Cannot connect to Supabase. Please check your credentials.');
    console.log('   You need to create the tables manually in the Supabase Dashboard.');
    console.log('\n   Go to: https://supabase.com/dashboard → SQL Editor');
    console.log('   Run the SQL from scripts/create-tables.sql\n');
    process.exit(1);
  }

  console.log('\n📦 Seeding data into tables...\n');
  
  await seedAbout();
  await seedSkills();
  await seedProjects();
  await seedExperience();
  await seedCertifications();

  console.log('\n═══════════════════════════════════════════');
  console.log('  ✅ Setup complete!');
  console.log('═══════════════════════════════════════════');
  console.log('\n📋 IMPORTANT: You must create the tables in Supabase Dashboard first!');
  console.log('   Go to: https://supabase.com/dashboard/project/viglxfgxaqtlgfzfkqwf/sql');
  console.log('   Copy & paste the SQL from: scripts/create-tables.sql');
  console.log('   Then re-run this script to seed data.\n');
}

main().catch(console.error);
