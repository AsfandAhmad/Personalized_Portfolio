import { useState } from 'react';
import { motion } from 'framer-motion';
import NeonButton from './NeonButton';
import { FaLock, FaUser } from 'react-icons/fa';

export default function AdminLogin({ onLogin }) {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
      } else {
        onLogin();
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            <span className="text-white">Admin </span>
            <span className="neon-text">Panel</span>
          </h1>
          <p className="text-gray-500 text-sm">Sign in to manage your portfolio</p>
        </div>

        <div className="glass-card rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  required
                  placeholder="Enter username"
                  className="neon-input pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="neon-input pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <NeonButton
              type="submit"
              variant="solid"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </NeonButton>
          </form>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          Protected area. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  );
}
