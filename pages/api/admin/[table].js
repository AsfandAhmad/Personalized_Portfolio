import { supabaseAdmin as supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

/**
 * Generic CRUD API handler for admin operations.
 * Supports: GET (list), POST (create), PUT (update), DELETE (remove)
 *
 * Usage: /api/admin/[table]?id=xxx
 */

const ALLOWED_TABLES = [
  'about',
  'skills',
  'projects',
  'experience',
  'certifications',
  'blog_posts',
  'messages',
  'chatbot_logs',
];

export default async function handler(req, res) {
  const { table } = req.query;

  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(400).json({ error: `Invalid table: ${table}` });
  }

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Supabase is not configured' });
  }

  try {
    switch (req.method) {
      // ─── LIST / GET ALL ──────────────────────────────────────
      case 'GET': {
        const orderCol = ['messages', 'chatbot_logs'].includes(table)
          ? 'created_at'
          : 'order';
        const ascending = !['messages', 'chatbot_logs'].includes(table);

        let query = supabase.from(table).select('*');

        // about table is single-row
        if (table === 'about') {
          const { data, error } = await query.single();
          if (error && error.code !== 'PGRST116') {
            return res.status(500).json({ error: error.message });
          }
          return res.status(200).json({ data: data ? [data] : [] });
        }

        const { data, error } = await query.order(orderCol, { ascending });
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ data: data || [] });
      }

      // ─── CREATE ──────────────────────────────────────────────
      case 'POST': {
        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
          return res.status(400).json({ error: 'Request body is required' });
        }
        const { data, error } = await supabase
          .from(table)
          .insert([body])
          .select();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json({ data: data?.[0] || null });
      }

      // ─── UPDATE ──────────────────────────────────────────────
      case 'PUT': {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'ID is required for update' });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
          return res.status(400).json({ error: 'Request body is required' });
        }

        // Remove id and timestamps from update payload
        const { id: _id, created_at, updated_at, ...updateData } = body;

        const { data, error } = await supabase
          .from(table)
          .update(updateData)
          .eq('id', id)
          .select();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ data: data?.[0] || null });
      }

      // ─── DELETE ──────────────────────────────────────────────
      case 'DELETE': {
        const deleteId = req.query.id;
        if (!deleteId) return res.status(400).json({ error: 'ID is required for delete' });

        const { error } = await supabase.from(table).delete().eq('id', deleteId);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(`Admin API error [${table}]:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
