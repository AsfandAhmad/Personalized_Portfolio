# 🚀 Portfolio — Next.js + Three.js + Supabase

A professional, dynamic portfolio web application featuring a **neon red-black-white** theme, interactive 3D graphics, smooth animations, a chatbot, and a full admin panel.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![Three.js](https://img.shields.io/badge/Three.js-3D-red?logo=threedotjs)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-blue?logo=tailwindcss)

---

## ✨ Features

- **🎨 Neon UI Theme** — Red-black-white design with glowing effects, neon borders, and smooth animations
- **🌐 3D Hero Scene** — Interactive Three.js particle field with animated torus knot
- **📱 Fully Responsive** — Mobile, tablet, and desktop optimized
- **⚡ Dynamic Content** — All content fetched from Supabase (with fallback demo data)
- **🤖 Chatbot** — Floating chat assistant that answers questions about skills, projects, and experience
- **📧 Contact Form** — Sends emails via NodeMailer and stores in Supabase
- **🔐 Admin Panel** — Login-protected CRUD dashboard for all content
- **🎬 Framer Motion** — Smooth page transitions, scroll animations, and hover effects
- **📊 Skills Visualization** — Animated progress bars and circular charts
- **📅 Experience Timeline** — Neon-themed animated timeline
- **📝 Blog Section** — Dynamic blog posts from Supabase
- **🚀 Vercel Ready** — Optimized for deployment on Vercel

---

## 📁 Project Structure

```
Portfolio/
├── pages/
│   ├── _app.js              → App wrapper with Framer Motion transitions
│   ├── _document.js          → Custom HTML document
│   ├── index.js              → Main portfolio page (all sections)
│   ├── admin.js              → Admin dashboard (login-protected)
│   └── api/
│       ├── contact.js        → Contact form API (email + Supabase)
│       └── chatbot.js        → Chatbot API (rule-based + logging)
├── components/
│   ├── Navbar.js             → Responsive navigation with active section tracking
│   ├── Footer.js             → Footer with social links
│   ├── NeonButton.js         → Reusable neon-styled button component
│   ├── SectionWrapper.js     → Section layout with scroll animations
│   ├── Hero3DScene.js        → Three.js 3D scene (particles + torus knot)
│   ├── HeroSection.js        → Full-screen hero with 3D background
│   ├── AboutSection.js       → About me with photo and stats
│   ├── SkillsSection.js      → Skills with circular charts and progress bars
│   ├── ProjectsSection.js    → Filterable project grid
│   ├── ProjectCard.js        → Individual project card with hover effects
│   ├── ResumeSection.js      → Experience timeline
│   ├── BlogSection.js        → Blog posts grid
│   ├── ContactSection.js     → Contact info + form
│   ├── ContactForm.js        → Contact form component
│   ├── Chatbot.js            → Floating chatbot interface
│   ├── AdminLogin.js         → Admin login form
│   └── AdminDashboard.js     → Full admin CRUD dashboard
├── lib/
│   ├── supabaseClient.js     → Supabase client + data fetchers
│   ├── mailer.js             → NodeMailer email setup
│   └── fallbackData.js       → Demo data when Supabase is not configured
├── styles/
│   └── globals.css           → TailwindCSS + neon theme styles
├── public/
│   ├── assets/               → Images, resume PDF
│   ├── manifest.json
│   └── robots.txt
├── supabase-schema.sql       → Database schema (run in Supabase SQL Editor)
└── .env.local.example        → Environment variables template
```

---

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
cd Portfolio
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# Supabase (get from https://supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email (Gmail App Password: https://myaccount.google.com/apppasswords)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=your-email@gmail.com

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_NAME=Your Name
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication** → **Users** → Create an admin user (email + password)
4. Copy your project URL and anon key to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the portfolio and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## 🚀 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` to Vercel's Environment Variables
4. Deploy!

---

## 🎨 Customization

### Content
- **With Supabase**: Edit all content via the admin panel at `/admin`
- **Without Supabase**: Edit `lib/fallbackData.js` for demo content

### Theme Colors
Edit `tailwind.config.js` to change the neon theme:
```js
neon: {
  red: '#FF073A',      // Primary accent
  darkRed: '#CC0029',  // Darker variant
  lightRed: '#FF3366', // Lighter variant
}
```

### Personal Info
- Replace `public/assets/profile.jpg` with your photo
- Replace `public/assets/resume.pdf` with your resume
- Update social links in `components/Footer.js` and `components/ContactSection.js`

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `about` | Name, title, bio, photo, resume URL |
| `skills` | Skill name, category, proficiency level |
| `projects` | Title, description, images, tech stack, links |
| `experience` | Job title, company, dates, description |
| `blog_posts` | Blog articles with markdown content |
| `messages` | Contact form submissions |
| `chatbot_logs` | Chatbot conversation history |

---

## 🤖 Chatbot

The chatbot is rule-based and responds to keywords about:
- **Skills** — "What technologies do you know?"
- **Projects** — "Show me your projects"
- **Experience** — "What's your work experience?"
- **Contact** — "How can I reach you?"
- **Availability** — "Are you available for hire?"

Conversations are logged in Supabase and non-trivial queries trigger email notifications.

---

## 📝 License

MIT — Feel free to use and modify for your own portfolio!
