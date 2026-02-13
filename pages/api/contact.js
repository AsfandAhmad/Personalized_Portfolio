import { supabaseAdmin as supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// Only import nodemailer in API route (server-side only)
let sendContactEmail;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // 1. Store in Supabase
    if (isSupabaseConfigured()) {
      const { error: dbError } = await supabase.from('messages').insert([
        { name, email, subject, message, read: false },
      ]);
      if (dbError) console.error('Supabase insert error:', dbError);
    }

    // 2. Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      if (!sendContactEmail) {
        const mailer = await import('@/lib/mailer');
        sendContactEmail = mailer.sendContactEmail;
      }
      await sendContactEmail({ name, email, subject, message });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
