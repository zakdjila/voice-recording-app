const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.BUCKET_NAME || 'voice-recording-app-1759786441';

function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

function isValidAudioFile(filename) {
  const validExtensions = ['.webm', '.mp3', '.wav', '.ogg', '.m4a'];
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return validExtensions.includes(ext);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { filename, contentType } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    if (!isValidAudioFile(filename)) {
      return res.status(400).json({ error: 'Invalid file type. Only audio files are allowed.' });
    }

    const sanitizedFilename = sanitizeFilename(filename);
    const key = `uploads/${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType || 'audio/webm'
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes

    res.json({
      uploadUrl,
      key,
      filename: sanitizedFilename
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}