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
  if (!supabaseAdmin || !supabaseAdmin.storage) {
    console.error('Supabase admin not configured');
    return res.status(500).json({ error: 'Supabase Storage not configured. Check your SUPABASE_SERVICE_ROLE_KEY.' });
  }

  // Use /tmp for Vercel compatibility (writable on serverless)
  const tempDir = path.join('/tmp', 'uploads');
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
      const isAllowed = allowed.includes(mimetype);
      if (!isAllowed) {
        console.log(`Rejected file type: ${mimetype}`);
      }
      return isAllowed;
    },
  });

  try {
    console.log(`Starting upload for type: ${type}`);
    const [, files] = await form.parse(req);

    // formidable v3 returns arrays for each field
    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
      console.error('No file in upload');
      return res.status(400).json({ error: 'No file uploaded or file type not allowed' });
    }

    const uploadedFile = fileArray[0];
    console.log(`File received: ${uploadedFile.originalFilename}, size: ${uploadedFile.size}`);
    
    const fileName = path.basename(uploadedFile.filepath);
    const fileContent = fs.readFileSync(uploadedFile.filepath);

    // Upload to Supabase Storage
    const bucketPath = `${type}/${fileName}`;
    console.log(`Uploading to Supabase: ${bucketPath}`);
    
    const { data, error } = await supabaseAdmin.storage
      .from('portfolio-uploads')
      .upload(bucketPath, fileContent, {
        contentType: uploadedFile.mimetype,
        cacheControl: '3600',
        upsert: true,
      });

    // Clean up temp file
    try {
      fs.unlinkSync(uploadedFile.filepath);
    } catch (cleanupErr) {
      console.warn('Failed to cleanup temp file:', cleanupErr);
    }

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ 
        error: `Supabase upload failed: ${error.message}. Make sure the 'portfolio-uploads' bucket exists and is public.` 
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('portfolio-uploads')
      .getPublicUrl(bucketPath);

    console.log(`Upload successful: ${publicUrlData.publicUrl}`);
    return res.status(200).json({ url: publicUrlData.publicUrl, fileName: uploadedFile.originalFilename });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
