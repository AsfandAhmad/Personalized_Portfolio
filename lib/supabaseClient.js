import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseUrl.startsWith('https://')
  );
};

// Only create the client when properly configured; use a dummy placeholder otherwise
// so that imports don't blow up at build time.
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ order: () => ({ data: null, error: 'Not configured' }), single: () => ({ data: null, error: 'Not configured' }), eq: () => ({ order: () => ({ data: null, error: 'Not configured' }) }), data: null, error: 'Not configured' }),
        insert: () => ({ error: 'Not configured' }),
        update: () => ({ eq: () => ({ error: 'Not configured' }) }),
        delete: () => ({ eq: () => ({ error: 'Not configured' }) }),
      }),
      auth: {
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    };

// ─── Admin client (server-side only, bypasses RLS) ───────────────────────────
// NEVER expose this on the client side – no NEXT_PUBLIC_ prefix on the key
export const supabaseAdmin =
  isSupabaseConfigured() && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : supabase; // fallback to anon client if no service key

// ─── Data fetchers ───────────────────────────────────────────────────────────

export async function fetchAbout() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single();
  if (error) { console.error('fetchAbout:', error); return null; }
  return data;
}

export async function fetchSkills() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true });
  if (error) { console.error('fetchSkills:', error); return []; }
  return data || [];
}

export async function fetchProjects() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true });
  if (error) { console.error('fetchProjects:', error); return []; }
  return data || [];
}

export async function fetchExperience() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('order', { ascending: true });
  if (error) { console.error('fetchExperience:', error); return []; }
  return data || [];
}

export async function fetchBlogPosts() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchBlogPosts:', error); return []; }
  return data || [];
}

export async function fetchMessages() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchMessages:', error); return []; }
  return data || [];
}

export async function fetchChatLogs() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('chatbot_logs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchChatLogs:', error); return []; }
  return data || [];
}

export async function fetchCertifications() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('order', { ascending: true });
  if (error) { console.error('fetchCertifications:', error); return []; }
  return data || [];
}

// ─── Auth helpers ────────────────────────────────────────────────────────────

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
