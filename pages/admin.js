import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session via cookie
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        setAuthenticated(data.authenticated === true);
      } catch {
        setAuthenticated(false);
      }
      setLoading(false);
    }
    checkSession();
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {}
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel | Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {authenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </>
  );
}
