import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Disable Next.js default body parser so formidable can handle multipart data
export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_TYPES = ['resume', 'photos', 'projects'];

const MIME_WHITELIST = {
  resume: ['application/pdf'],
  photos: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  projects: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get upload type from query: /api/upload?type=resume|photos|projects
  const { type } = req.query;
  if (!ALLOWED_TYPES.includes(type)) {
    return res.status(400).json({ error: `Invalid type. Must be one of: ${ALLOWED_TYPES.join(', ')}` });
  }

  // Check if Supabase is properly configured
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const tempDir = path.join(process.cwd(), '.tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const form = formidable({
    uploadDir: tempDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    filename: (_name, ext, _part, _form) => {
      return `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    },
    filter: ({ mimetype }) => {
      const allowed = MIME_WHITELIST[type] || [];
      return allowed.includes(mimetype);
    },
  });

  try {
    const [, files] = await form.parse(req);

    // formidable v3 returns arrays for each field
    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No file uploaded or file type not allowed' });
    }

    const uploadedFile = fileArray[0];
    const fileName = path.basename(uploadedFile.filepath);
    const fileContent = fs.readFileSync(uploadedFile.filepath);

    // Upload to Supabase Storage
    const bucketPath = `${type}/${fileName}`;
    const { data, error } = await supabaseAdmin.storage
      .from('portfolio-uploads')
      .upload(bucketPath, fileContent, {
        cacheControl: '3600',
        upsert: true,
      });

    // Clean up temp file
    fs.unlinkSync(uploadedFile.filepath);

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('portfolio-uploads')
      .getPublicUrl(bucketPath);

    return res.status(200).json({ url: publicUrlData.publicUrl, fileName });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
