-- ============================================================================
-- PORTFOLIO DATABASE SCHEMA FOR SUPABASE
-- Run this SQL in your Supabase SQL Editor to create all required tables.
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── About Section ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  title TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Skills ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'Other',
  level INTEGER DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  icon TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Projects ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  impact TEXT DEFAULT '', -- New field for project impact
  learnings TEXT DEFAULT '', -- New field for key learnings
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Experience ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  company TEXT DEFAULT '',
  description TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  current BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ─── Education ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  degree TEXT NOT NULL DEFAULT '',
  institution TEXT NOT NULL DEFAULT '',
  field_of_study TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  current BOOLEAN DEFAULT FALSE,
  description TEXT DEFAULT '',
  gpa TEXT DEFAULT '',
  achievements TEXT[] DEFAULT '{}',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ─── Blog Posts ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  slug TEXT UNIQUE DEFAULT '',
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contact Messages ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Chatbot Logs ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chatbot_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT DEFAULT '',
  user_message TEXT DEFAULT '',
  bot_response TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security (RLS) ────────────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public read about" ON about FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);

-- Allow anonymous inserts for messages and chatbot logs (contact form / chatbot)
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert chatbot logs" ON chatbot_logs FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access to all tables
CREATE POLICY "Admin full access about" ON about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access chatbot_logs" ON chatbot_logs FOR ALL USING (auth.role() = 'authenticated');

-- ─── Updated_at trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_about_updated_at
  BEFORE UPDATE ON about
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DONE! Now create an admin user in Supabase Authentication dashboard.
-- ============================================================================
