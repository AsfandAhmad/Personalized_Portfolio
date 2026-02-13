import Head from 'next/head';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ResumeSection from '@/components/ResumeSection';
import CertificationsSection from '@/components/CertificationsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ChatbotEnhanced from '@/components/ChatbotEnhanced';

import {
  fetchAbout,
  fetchSkills,
  fetchProjects,
  fetchExperience,
  fetchBlogPosts,
  fetchCertifications,
  isSupabaseConfigured,
} from '@/lib/supabaseClient';

import {
  fallbackAbout,
  fallbackSkills,
  fallbackProjects,
  fallbackExperience,
  fallbackBlogPosts,
  fallbackCertifications,
} from '@/lib/fallbackData';

export default function Home({ about, skills, projects, experience, blogPosts, certifications }) {
  return (
    <>
      <Head>
        <title>{`${about?.name || 'Developer'} | Portfolio`}</title>
        <meta
          name="description"
          content={about?.tagline || 'Full-Stack Developer Portfolio'}
        />
        <meta property="og:title" content={`${about?.name || 'Developer'} | Portfolio`} />
        <meta property="og:description" content={about?.tagline || 'Full-Stack Developer Portfolio'} />
        <meta property="og:type" content="website" />
      </Head>

      <Navbar />

      <main>
        <HeroSection about={about} />
        <AboutSection about={about} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ResumeSection experience={experience} resumeUrl={about?.resume_url} />
        <CertificationsSection certifications={certifications} />
        <ContactSection />
      </main>

      <Footer />
      <ChatbotEnhanced />
    </>
  );
}

export async function getServerSideProps() {
  let about, skills, projects, experience, blogPosts;

  let certifications;

  if (isSupabaseConfigured()) {
    [about, skills, projects, experience, blogPosts, certifications] = await Promise.all([
      fetchAbout(),
      fetchSkills(),
      fetchProjects(),
      fetchExperience(),
      fetchBlogPosts(),
      fetchCertifications(),
    ]);
  }

  return {
    props: {
      about: about || fallbackAbout,
      skills: skills?.length ? skills : fallbackSkills,
      projects: projects?.length ? projects : fallbackProjects,
      experience: experience?.length ? experience : fallbackExperience,
      blogPosts: blogPosts?.length ? blogPosts : fallbackBlogPosts,
      certifications: certifications?.length ? certifications : fallbackCertifications,
    },
  };
}
