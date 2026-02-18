import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

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

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    filename: (_name, ext, _part, _form) => {
      // Generate a unique filename: timestamp-random + original ext
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

    const uploaded = fileArray[0];
    const fileName = path.basename(uploaded.filepath);
    const publicUrl = `/uploads/${type}/${fileName}`;

    return res.status(200).json({ url: publicUrl, fileName });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
