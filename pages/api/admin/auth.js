import { serialize } from 'cookie';
import crypto from 'crypto';

/**
 * Admin Authentication API
 * POST /api/admin/auth - Login with username/password
 * DELETE /api/admin/auth - Logout
 * GET /api/admin/auth - Check session
 */

// Hardcoded admin credentials (only one admin)
const ADMIN_UID = process.env.ADMIN_UID || 'AsfandAhmed';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Asfand-10';

// Simple token generation
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// In-memory session store (resets on server restart, which is fine for single-admin)
const sessions = new Map();

function createSession() {
  const token = generateToken();
  sessions.set(token, { createdAt: Date.now(), uid: ADMIN_UID });
  return token;
}

function validateSession(token) {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  // Sessions expire after 24 hours
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function destroySession(token) {
  if (token) sessions.delete(token);
}

const COOKIE_NAME = 'admin_session';

export default function handler(req, res) {
  switch (req.method) {
    // ─── LOGIN ─────────────────────────────────────────────
    case 'POST': {
      const { uid, password } = req.body || {};

      if (!uid || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      if (uid !== ADMIN_UID || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = createSession();

      // Set HTTP-only cookie
      res.setHeader('Set-Cookie', serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60, // 24 hours
      }));

      return res.status(200).json({ success: true, message: 'Logged in successfully' });
    }

    // ─── CHECK SESSION ─────────────────────────────────────
    case 'GET': {
      const token = req.cookies?.[COOKIE_NAME];
      const valid = validateSession(token);
      return res.status(200).json({ authenticated: valid });
    }

    // ─── LOGOUT ────────────────────────────────────────────
    case 'DELETE': {
      const token = req.cookies?.[COOKIE_NAME];
      destroySession(token);

      res.setHeader('Set-Cookie', serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      }));

      return res.status(200).json({ success: true, message: 'Logged out' });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
