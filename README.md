# 🎙️ Voice Recording App

A beautiful, modern web application that lets you record your voice, automatically transcribe it using AI, and save everything to the cloud. Think of it as your personal voice memo app, but supercharged with artificial intelligence!

## 🌟 What Does This App Do?

Imagine this: You click a button, speak into your microphone, and when you're done, the app automatically:
- Saves your audio recording to the cloud (Amazon S3)
- Transcribes what you said into text using OpenAI's Whisper AI
- Gives you a shareable link so others can listen to your recording
- Lets you copy or download the transcription

All with a gorgeous, glass-like interface that works on both light and dark themes!

## 🎯 Perfect For

- **Voice Notes**: Quick thoughts you want to capture and transcribe
- **Interviews**: Record conversations and get instant transcriptions
- **Meeting Notes**: Record meetings and get searchable text
- **Content Creation**: Create audio content with automatic subtitles/transcripts
- **Language Learning**: Practice speaking and see what you said in text
- **Accessibility**: Convert spoken words to written text

## 🚀 How It Works (The Simple Explanation)

### The Recording Process

1. **You Click "Record"**
   - The app asks your browser for permission to use your microphone (just once)
   - A beautiful gradient button starts pulsing to show it's recording

2. **You Speak**
   - The app captures your voice in real-time
   - You see a waveform animation showing it's working
   - Your audio is being saved in high-quality format (WebM or MP4)

3. **You Click "Stop"**
   - The recording stops and gets packaged up
   - The app creates a temporary audio file on your computer

4. **Automatic Upload to Cloud**
   - The app sends your audio file to Amazon S3 (a cloud storage service)
   - You see a progress bar showing the upload percentage
   - Once uploaded, the file gets a permanent URL (web address)

5. **AI Transcription Magic** ✨
   - The app sends your audio to OpenAI's Whisper AI
   - Whisper "listens" to your recording and writes down what you said
   - This happens in seconds, even for longer recordings
   - The transcription appears in a beautiful card below your recording

6. **Done!**
   - You can play back your recording
   - Copy the transcription to your clipboard
   - Download the transcription as a text file
   - Share the recording URL with others

## 🏗️ The Technology Stack (What's Under the Hood)

### Frontend (What You See and Interact With)

- **HTML/CSS/JavaScript**: The basic building blocks of web pages
  - `index.html`: The structure of the page
  - `styles.css`: All the beautiful colors, animations, and layouts
  - `app.js`: The main controller that coordinates everything

- **Specialized JavaScript Modules**:
  - `recorder.js`: Handles microphone access and audio recording
  - `uploader.js`: Manages file uploads to the cloud
  - `player.js`: Controls audio playback

### Backend (The Behind-the-Scenes Server)

- **Node.js**: A JavaScript runtime that lets us run code on a server
- **Express**: A framework that makes it easy to create web servers
  - Think of it as a traffic controller for web requests

### Cloud Services (The External Helpers)

1. **Amazon S3 (Simple Storage Service)**
   - Where all your audio recordings live permanently
   - Like Dropbox or Google Drive, but specifically for this app
   - Each recording gets a unique URL that never changes

2. **OpenAI Whisper**
   - An AI model trained on 680,000 hours of speech
   - Incredibly accurate at converting speech to text
   - Understands multiple languages automatically

## 🔧 Technical Deep Dive (For the Curious)

### How Recording Works

```
1. Browser MediaRecorder API
   ↓
2. Captures audio chunks every second
   ↓
3. Stores chunks in an array
   ↓
4. On stop: combines all chunks into one Blob (binary data)
   ↓
5. Creates a local URL to preview the recording
```

**Why This Matters**: The MediaRecorder API is built into modern browsers. It handles all the complex audio encoding for you. The app just asks for chunks of data and stitches them together like a puzzle.

### How Upload Works

```
1. Audio Blob gets converted to a File object
   ↓
2. File is sent via HTTP POST to /api/upload
   ↓
3. Server receives the file using Multer (a file upload handler)
   ↓
4. Server generates a unique filename with timestamp
   ↓
5. Server uses AWS SDK to send file to S3 bucket
   ↓
6. S3 returns a permanent URL
   ↓
7. Server sends URL back to browser
   ↓
8. Browser displays the recording with playback controls
```

**Why This Matters**: Files don't upload instantly—they're broken into packets and sent over the internet. The progress bar is calculated by tracking how many bytes have been sent versus the total file size.

### How Transcription Works

```
1. Browser sends the audio URL to /api/transcribe
   ↓
2. Server downloads the audio file from S3
   ↓
3. Server sends audio to OpenAI's Whisper API
   ↓
4. Whisper processes the audio:
   - Converts audio to mel-spectrogram (visual representation of sound)
   - Runs it through a neural network trained on speech
   - Generates text word by word with confidence scores
   ↓
5. Whisper returns JSON with transcription + metadata
   ↓
6. Server sends transcription back to browser
   ↓
7. Browser displays the text in a beautiful card
```

**Why This Matters**: Whisper doesn't just "hear" your words—it understands context, accents, and can even handle background noise. It's the same technology that powers professional transcription services.

### How the Beautiful UI Works

The app uses a design technique called **glassmorphism**:

- **Backdrop Blur**: Creates a frosted glass effect
  ```css
  backdrop-filter: blur(10px);
  ```
  This blurs everything behind the card, like looking through textured glass.

- **Transparency**: Cards are semi-transparent
  ```css
  background: rgba(255, 255, 255, 0.9);
  ```
  The `0.9` means 90% opaque (10% see-through).

- **Gradients**: Smooth color transitions
  ```css
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  ```
  This creates a purple-to-pink diagonal gradient.

- **Shadows**: Multiple layers of shadows create depth
  ```css
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  ```
  The first shadow is large and soft, the second is small and sharp.

## 📁 File Structure Explained

```
voice-recording-app/
│
├── server.js                    # Main server file (the brain)
│   ├── Sets up Express server
│   ├── Configures AWS S3 connection
│   ├── Handles file uploads
│   ├── Manages transcription requests
│   └── Serves the frontend files
│
├── public/                      # Frontend files (what users see)
│   ├── index.html              # The main page structure
│   ├── styles.css              # All the beautiful styling
│   ├── app.js                  # Main JavaScript controller
│   ├── recorder.js             # Handles recording logic
│   ├── uploader.js             # Handles file uploads
│   └── player.js               # Handles audio playback
│
├── package.json                 # Lists all the dependencies
│   └── Dependencies are code libraries other people wrote
│       that we use (like Express, AWS SDK, OpenAI)
│
├── .env                         # Secret configuration (not in git)
│   ├── OPENAI_API_KEY          # Your OpenAI API key
│   └── Other environment settings
│
└── voice-recording-api-user_accessKeys.csv
    └��─ AWS credentials to access S3 bucket
```

## 🎨 Key Features Explained

### 1. Automatic Transcription

**What It Does**: Converts your voice to text automatically after recording.

**How It Works**:
- When you finish a recording, the app automatically calls the `/api/transcribe` endpoint
- The server downloads your audio from S3
- It sends the audio to OpenAI's Whisper API with a simple request
- Whisper returns the transcription in about 2-5 seconds (depending on recording length)
- The transcription appears with a beautiful "AI-Powered" badge

**The Code Flow**:
```javascript
// 1. User stops recording → audio is uploaded
// 2. app.js automatically calls:
fetch('/api/transcribe', {
  method: 'POST',
  body: JSON.stringify({ fileUrl: audioUrl })
})

// 3. server.js receives request and calls OpenAI:
const transcription = await openai.audio.transcriptions.create({
  file: audioFileStream,
  model: "whisper-1"
})

// 4. Returns text back to browser
```

### 2. Cloud Storage with AWS S3

**What It Does**: Stores your audio files permanently in the cloud.

**Why S3?**:
- **Reliability**: Amazon guarantees 99.999999999% (11 nines) durability
- **Scalability**: Can store unlimited files
- **Speed**: Fast downloads from anywhere in the world
- **Cost**: Pay only for what you use (pennies per GB)

**The Upload Process**:
1. Your audio file (Blob) is converted to a Buffer (raw binary data)
2. The server creates a unique filename: `recording-[timestamp]-[random].webm`
3. The AWS SDK sends a `PutObjectCommand` to S3
4. S3 stores the file and returns a URL like:
   `https://voice-recording-app.s3.amazonaws.com/recording-1234567890-abc.webm`

### 3. Beautiful Dark/Light Theme

**What It Does**: Adapts the entire interface based on your system preference.

**How It Works**:
```javascript
// Detects your system theme
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Applies different CSS classes
document.body.classList.toggle('dark-theme', isDarkMode);
```

**CSS Variables** change based on theme:
```css
/* Light theme */
--bg-primary: #fafbfc;
--text-primary: #1a1a1a;

/* Dark theme */
--bg-primary: #0a0e1a;
--text-primary: #ffffff;
```

This means one CSS rule works for both themes:
```css
body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

### 4. Real-Time Progress Tracking

**What It Does**: Shows you exactly what's happening at every step.

**Upload Progress**:
```javascript
xhr.upload.addEventListener('progress', (e) => {
  const percent = (e.loaded / e.total) * 100;
  updateProgressBar(percent);
});
```
- `e.loaded`: Bytes uploaded so far
- `e.total`: Total bytes to upload
- Updates the progress bar every few milliseconds

**Transcription Loading**:
```javascript
showLoadingState('Transcribing audio...');
// Shows animated spinner
// Replaces with transcription when done
```

### 5. Copy & Download Transcriptions

**Copy to Clipboard**:
```javascript
navigator.clipboard.writeText(transcriptionText)
  .then(() => showSuccessMessage('Copied!'));
```
Uses the modern Clipboard API to copy text without Flash or special permissions.

**Download as File**:
```javascript
const blob = new Blob([transcriptionText], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'transcription.txt';
link.click();
```
Creates a temporary download link and simulates clicking it.

## 🔐 Security Features

### 1. API Key Protection

**The Problem**: If you put your OpenAI API key in the frontend JavaScript, anyone can steal it and rack up charges on your account.

**The Solution**:
- API keys are stored in `.env` file (never committed to GitHub)
- Only the server (backend) has access to the keys
- Frontend makes requests to the server, server calls OpenAI
- Users never see the API key

### 2. Rate Limiting

**The Problem**: Someone could spam your server with thousands of requests.

**The Solution**:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // 100 requests per 15 minutes
});
```
After 100 requests in 15 minutes, the server responds with "Too many requests."

### 3. CORS (Cross-Origin Resource Sharing)

**The Problem**: By default, browsers block requests from one website to another.

**The Solution**:
```javascript
app.use(cors({
  origin: '*',  // Allow requests from anywhere
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));
```
This tells browsers: "It's okay for this frontend to talk to this backend."

### 4. File Validation

**The Problem**: Someone could try to upload a virus disguised as an audio file.

**The Solution**: The app only accepts specific MIME types:
```javascript
upload.single('audio')  // Only accepts audio/* files
```

## ⚙️ Setup Instructions (Step by Step)

### Prerequisites

You'll need these installed on your computer:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org
   - Check version: `node --version`

2. **An AWS Account** (for S3 storage)
   - Sign up at: https://aws.amazon.com
   - Free tier includes 5GB of storage

3. **An OpenAI Account** (for transcription)
   - Sign up at: https://platform.openai.com
   - You'll need to add payment info, but costs are minimal

### Step 1: Clone or Download the Project

```bash
# If using Git:
git clone <repository-url>
cd voice-recording-app

# If downloaded as ZIP:
# Extract the ZIP and open terminal in that folder
```

### Step 2: Install Dependencies

```bash
npm install
```

**What This Does**:
- Reads `package.json` to see what libraries are needed
- Downloads all dependencies from NPM (Node Package Manager)
- Creates a `node_modules` folder with all the code libraries

**Dependencies Explained**:
- `express`: Web server framework
- `@aws-sdk/client-s3`: Talk to Amazon S3
- `openai`: Talk to OpenAI API
- `multer`: Handle file uploads
- `cors`: Enable cross-origin requests
- `dotenv`: Load environment variables from `.env`

### Step 3: Set Up AWS S3

1. **Create an S3 Bucket**:
   - Go to AWS Console → S3
   - Click "Create bucket"
   - Name it `voice-recording-app` (or update `BUCKET_NAME` in server.js)
   - Region: `us-east-1` (or update `REGION` in server.js)
   - Uncheck "Block all public access" (we need files to be accessible)
   - Create bucket

2. **Configure CORS** (so browsers can access files):
   ```bash
   node setup-s3-cors.js
   ```
   This sets rules allowing browsers to download audio from S3.

3. **Configure Bucket Policy** (so files can be read):
   ```bash
   node setup-bucket-policy.js
   ```
   This makes files in the bucket publicly readable.

4. **Get AWS Credentials**:
   - AWS Console → IAM → Users → Create User
   - Give it `AmazonS3FullAccess` permission
   - Create access key → Download CSV
   - Save CSV as `voice-recording-api-user_accessKeys.csv` in project root

### Step 4: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Create a file named `.env` in project root
5. Add this line:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

### Step 5: Start the Server

```bash
npm start
```

**What Happens**:
- Server starts on port 3001
- Loads AWS credentials from CSV
- Loads OpenAI key from `.env`
- Starts listening for requests
- You'll see: `Server running on port 3001`

### Step 6: Open the App

Open your browser and go to:
```
http://localhost:3001
```

You should see the beautiful voice recording interface!

## 🎯 How to Use the App

### Recording Your First Audio

1. **Click the "Start Recording" button**
   - Your browser will ask for microphone permission → Click "Allow"
   - The button will change to "Stop Recording" with a pulsing animation

2. **Speak into your microphone**
   - Talk clearly for best transcription results
   - You'll see a waveform showing your voice

3. **Click "Stop Recording"**
   - The recording stops
   - Upload begins automatically
   - You'll see a progress bar

4. **Wait for transcription**
   - After upload completes, transcription starts automatically
   - You'll see "Transcribing audio..." with a spinner
   - In a few seconds, your transcription appears

5. **Interact with your recording**:
   - **Play**: Click play button to listen
   - **Copy**: Click "Copy" to copy transcription to clipboard
   - **Download**: Click "Download" to save transcription as .txt
   - **Share**: Copy the URL to share with others

## 🐛 Troubleshooting

### Microphone Not Working

**Problem**: Browser won't access microphone
**Solution**:
- Check browser permissions (click lock icon in address bar)
- Try HTTPS instead of HTTP (required on some browsers)
- Try a different browser (Chrome and Firefox work best)

### Upload Fails

**Problem**: File won't upload to S3
**Solution**:
- Check AWS credentials in CSV file
- Verify bucket name matches in server.js
- Check bucket exists and is in correct region
- Verify bucket policy and CORS are configured

### Transcription Fails

**Problem**: "Transcription failed" message
**Solution**:
- Check OpenAI API key in `.env`
- Verify you have credits in your OpenAI account
- Check server logs for error details
- Try a shorter recording first (under 30 seconds)

### Server Won't Start

**Problem**: Error starting server
**Solution**:
- Ensure Node.js 18+ is installed: `node --version`
- Run `npm install` to install dependencies
- Check port 3001 isn't already in use
- Verify `.env` and CSV files exist

## 💡 Advanced Features

### Environment Variables

Create a `.env` file to customize behavior:

```env
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional
PORT=3001                           # Server port
OPENAI_TITLE_MODEL=gpt-4.1-mini     # Model for AI titles
ENABLE_AI_TITLES=true               # Auto-generate titles
AI_TITLE_TEMPERATURE=0.2            # Creativity (0-2)
AI_TITLE_MAX_TOKENS=20              # Max title length
```

### Audio Enhancement (Optional)

If you have Python and audio processing libraries:

```env
ENABLE_AUDIO_ENHANCEMENT=true
AUDIO_ENHANCEMENT_SCRIPT=./scripts/enhance_audio.py
```

This will clean up background noise before transcription.

## 📊 API Endpoints Reference

### POST /api/upload
Upload an audio file to S3.

**Request**:
- Content-Type: multipart/form-data
- Body: audio file (field name: "audio")

**Response**:
```json
{
  "success": true,
  "fileUrl": "https://voice-recording-app.s3.amazonaws.com/recording-123.webm",
  "message": "File uploaded successfully"
}
```

### POST /api/transcribe
Transcribe an audio file using OpenAI Whisper.

**Request**:
```json
{
  "fileUrl": "https://voice-recording-app.s3.amazonaws.com/recording-123.webm"
}
```

**Response**:
```json
{
  "success": true,
  "transcription": "This is what you said in the recording.",
  "language": "en",
  "duration": 15.5
}
```

### GET /api/health
Check server status.

**Response**:
```json
{
  "status": "ok",
  "bucket": "voice-recording-app",
  "region": "us-east-1",
  "features": {
    "transcription": true,
    "audioEnhancement": false
  }
}
```

## 🚀 Deployment to Production

### Deploy to Heroku

1. Create Heroku account
2. Install Heroku CLI
3. Run:
   ```bash
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=sk-your-key
   git push heroku main
   ```

### Deploy to AWS EC2

1. Launch EC2 instance (Ubuntu)
2. SSH into instance
3. Install Node.js
4. Clone repository
5. Run with PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Environment Variables in Production

Never commit `.env` or CSV files to Git!
- Use Heroku Config Vars
- Use AWS Systems Manager Parameter Store
- Use environment variables on your hosting platform

## 📝 Code Examples

### Adding a New Feature: Saving Recordings Locally

**Frontend (app.js)**:
```javascript
async function saveRecordingLocally(audioBlob) {
  // Create a download link
  const url = URL.createObjectURL(audioBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recording-${Date.now()}.webm`;
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
}

// Call after recording stops:
saveRecordingLocally(recordedBlob);
```

### Adding a New Feature: Email Transcription

**Backend (server.js)**:
```javascript
const nodemailer = require('nodemailer');

app.post('/api/email-transcription', async (req, res) => {
  const { email, transcription } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    to: email,
    subject: 'Your Transcription',
    text: transcription
  });

  res.json({ success: true });
});
```

## 🎓 Learning Resources

### Understanding the Technologies

- **JavaScript**: https://javascript.info
- **Node.js**: https://nodejs.dev/learn
- **Express**: https://expressjs.com/en/starter/installing.html
- **AWS S3**: https://docs.aws.amazon.com/s3/
- **OpenAI API**: https://platform.openai.com/docs

### How Audio Works on the Web

- **MediaRecorder API**: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Audio Formats**: WebM, MP4, WAV explained

## 🤝 Contributing

Want to improve this app? Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add amazing feature"`
6. Push: `git push origin amazing-feature`
7. Create a Pull Request

## 📜 License

This project is open source and available under the ISC License.

## 🎉 Credits

Built with:
- **OpenAI Whisper**: State-of-the-art speech recognition
- **AWS S3**: Reliable cloud storage
- **Express.js**: Fast, minimalist web framework
- **Modern CSS**: Glassmorphism design trend

---

**Made with ❤️ to make voice recording and transcription accessible to everyone!**

If you have questions, found a bug, or want to request a feature, please open an issue on GitHub!
