const { S3Client } = require('@aws-sdk/client-s3');

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const bucketName = process.env.BUCKET_NAME || 'voice-recording-app-1759786441';
  const region = process.env.AWS_REGION || 'us-east-1';
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  res.json({
    status: 'ok',
    bucket: bucketName,
    region: region,
    features: {
      transcription: hasOpenAI
    }
  });
}