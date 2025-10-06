const OpenAI = require('openai');

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
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ error: 'File URL is required' });
    }

    // Check if OpenAI API key is set
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Download audio file from URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to download audio file');
    }

    const buffer = await response.arrayBuffer();
    const audioFile = Buffer.from(buffer);

    // Create a File object for OpenAI
    const urlObject = new URL(fileUrl);
    const originalFilename = urlObject.pathname.split('/').pop();
    
    const file = new File([audioFile], originalFilename, { 
      type: 'audio/webm' 
    });

    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en'
    });

    res.json({
      success: true,
      transcription: transcription?.text || '',
      language: 'en',
      duration: null,
      title: null,
      filename: originalFilename,
      shareableUrl: fileUrl
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: error.message || 'Failed to transcribe audio'
    });
  }
}