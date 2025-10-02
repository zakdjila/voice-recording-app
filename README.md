# 🎙️ Voice Recording App

A beautiful, user-friendly web application that lets you record your voice, save it to the cloud, and turn your words into text using artificial intelligence.

---

## 🌟 What Does This App Do?

Think of this app as your personal voice assistant that lives in your web browser. Here's what makes it special:

### **Record Your Voice Anywhere**
Simply click a button, speak into your device's microphone, and the app captures crystal-clear audio. Whether you're:
- Recording quick voice memos
- Capturing meeting notes
- Saving ideas on the go
- Creating audio diaries

The app makes it effortless.

### **Automatic Cloud Backup**
Every recording you make is instantly saved to Amazon's secure cloud storage (called S3). This means:
- Your recordings are safe even if your device breaks
- You can access them from any device
- You never have to worry about running out of space on your phone or computer
- Each recording gets its own unique web address that you can share with anyone

### **AI-Powered Transcription**
The app uses OpenAI's cutting-edge technology to convert your spoken words into written text. Within seconds of finishing a recording:
- The audio is sent to OpenAI's Whisper AI (the same technology that powers many voice assistants)
- Whisper "listens" to your recording and types out every word
- You get a complete, accurate transcript that you can copy, download, or share

### **Smart Titles for Your Recordings**
Here's where it gets really clever: The app reads your transcript and automatically creates a short, descriptive title for your recording. For example:
- If you recorded a grocery list, it might name it "grocery-shopping-list"
- If you recorded meeting notes, it might call it "team-meeting-notes"
- If you shared a quick idea, it might name it "new-project-idea"

This makes it incredibly easy to find and organize your recordings later.

---

## 🎨 Beautiful Design Features

### **Dark Mode & Light Mode**
The app automatically adapts to your preference:
- **Light mode** features soft, frosted glass effects with gentle shadows
- **Dark mode** offers a sleek, modern interface that's easy on the eyes at night
- Both themes are carefully designed to be beautiful and easy to read

### **Visual Recording Feedback**
When you're recording, the app comes alive with:
- A pulsing red recording indicator
- A real-time timer showing how long you've been recording
- Animated waveforms that react to your voice
- Beautiful color animations that create an engaging experience

### **Organized Recording Library**
All your recordings appear in an elegant list showing:
- When each recording was made
- How long each recording is
- Quick action buttons to play, download, share, or delete
- A search feature to find specific recordings instantly

---

## 🔧 How It Works Behind The Scenes

### **Step 1: Recording**
When you click the record button:
1. Your browser asks permission to use your microphone
2. The app starts capturing audio in high-quality WebM format
3. As you speak, the audio data is temporarily stored in your browser's memory
4. When you click stop, all that audio data is packaged into a single file

### **Step 2: Cloud Upload**
Once recording stops:
1. The audio file is sent to the app's server (a computer program running on your machine)
2. The server connects to Amazon S3 (a massive digital warehouse where millions of websites store files)
3. Your recording is uploaded to S3 with a unique identifier
4. S3 generates a special web link that anyone can use to listen to your recording
5. The server sends this link back to your browser

### **Step 3: AI Transcription**
Immediately after upload:
1. The app sends your recording's web link to OpenAI's servers
2. OpenAI downloads your audio and runs it through their Whisper AI model
3. Whisper analyzes the sound patterns, recognizes speech, and converts it to text
4. The transcript is sent back to the app
5. The app displays the transcript in a beautiful, readable format

### **Step 4: AI Title Generation**
After transcription completes:
1. The app sends your transcript to OpenAI's language model (GPT)
2. The AI reads your transcript and creates a 1-4 word summary
3. The app converts this title into a web-friendly format (lowercase, hyphens instead of spaces)
4. The recording file is automatically renamed in S3 using this new title
5. The title appears in your interface so you can easily identify the recording

---

## 📋 What You Need To Get Started

### **1. Node.js (The Engine)**
Node.js is like the engine that powers the app. It's a program that lets your computer run JavaScript code outside of a web browser.
- You need version 18 or newer
- Download it from [nodejs.org](https://nodejs.org)
- After installing, you can check if it worked by opening a terminal and typing `node --version`

### **2. OpenAI API Key (The AI Brain)**
This is your personal password to use OpenAI's artificial intelligence services:
- Sign up at [OpenAI's website](https://platform.openai.com)
- Go to the API section and create an API key
- This key lets the app use Whisper (for transcription) and GPT (for titles)
- Keep this key secret—it's like a password to your OpenAI account

### **3. AWS Account & Credentials (The Cloud Storage)**
Amazon Web Services (AWS) is where your recordings are stored:
- Create a free AWS account at [aws.amazon.com](https://aws.amazon.com)
- Set up S3 (Simple Storage Service)—it's like renting a digital storage unit
- Create an "access key" which is like a key to your storage unit
- Download the credentials file (it looks like a spreadsheet with your access codes)

---

## 🚀 Setting Up The App

### **Step 1: Download The Code**
Get the app files onto your computer by either:
- Downloading the ZIP file from GitHub
- Or, if you know Git: `git clone <repository-url>`

### **Step 2: Install Dependencies**
Dependencies are pre-built tools and libraries the app needs to function. Open a terminal in the app folder and run:
```bash
npm install
```

This command reads the `package.json` file (like a shopping list) and downloads all necessary components:
- **Express**: Handles web server operations
- **AWS SDK**: Communicates with Amazon S3
- **OpenAI**: Connects to AI services
- **Multer**: Handles file uploads
- And several others for security, formatting, and functionality

### **Step 3: Configure Your Credentials**

#### **Create the .env file**
Copy the `.env.example` file and rename it to `.env`. Then fill in your information:

```
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3001
```

**What each setting means:**
- `OPENAI_API_KEY`: Your password to use OpenAI's AI services
- `PORT`: The "door number" where the app runs on your computer (3001 is the default)

#### **Add Your AWS Credentials File**
Place your AWS credentials CSV file (named `voice-recording-api-user_accessKeys.csv`) in the app's main folder. This file contains:
- **Access Key ID**: Like a username for S3
- **Secret Access Key**: Like a password for S3

The app reads this file automatically when it starts.

### **Step 4: Start The App**
Run one of these commands:

**For normal use:**
```bash
npm start
```

**For development (auto-restarts when you change code):**
```bash
npm run dev
```

You'll see a message like: `Server running on http://localhost:3001`

### **Step 5: Open In Your Browser**
Open your web browser and go to: `http://localhost:3001`

You should see the beautiful voice recording interface ready to use!

---

## 🎯 How To Use The App

### **Recording Your First Audio**
1. Click the big red **"Start Recording"** button
2. Your browser will ask permission to use your microphone—click "Allow"
3. Speak clearly into your microphone
4. Watch the timer count up and the waveform dance to your voice
5. Click **"Stop Recording"** when you're done
6. The app automatically saves your recording to the cloud

### **Viewing Your Transcription**
1. After a recording is saved, transcription happens automatically
2. Wait a few seconds while the AI processes your audio
3. The transcript appears below your recording with a beautiful "AI Powered" badge
4. If AI titles are enabled, you'll see a suggested title at the top

### **Managing Your Recordings**
Each recording in your list has action buttons:
- **▶️ Play**: Listen to the recording right in the browser
- **⬇️ Download**: Save a copy to your computer
- **🔗 Share**: Copy the web link to share with others
- **🗑️ Delete**: Remove the recording permanently

### **Copying or Downloading Transcripts**
Under each transcript, you'll find buttons to:
- **Copy**: Put the text on your clipboard to paste elsewhere
- **Download**: Save the transcript as a text file

### **Using the Search Feature**
Type keywords into the search box to filter recordings by title or date.

---

## ⚙️ Advanced Configuration Options

### **Customizing AI Title Generation**

You can fine-tune how the AI creates titles by adding these settings to your `.env` file:

```
# Control AI Title Generation
ENABLE_AI_TITLES=true
OPENAI_TITLE_MODEL=gpt-4.1-mini
AI_TITLE_TEMPERATURE=0.2
AI_TITLE_MAX_TOKENS=20
AI_TITLE_PROMPT=Summarize the following transcript in 1 to 4 words. Return only the concise title.
```

**What each setting controls:**

- **ENABLE_AI_TITLES**: Turn title generation on (`true`) or off (`false`)
- **OPENAI_TITLE_MODEL**: Which AI model to use (gpt-4.1-mini is fast and affordable)
- **AI_TITLE_TEMPERATURE**: How creative the AI should be (0.0 = very focused, 1.0 = very creative)
- **AI_TITLE_MAX_TOKENS**: Maximum number of words in the title
- **AI_TITLE_PROMPT**: The instruction given to the AI about how to create titles

### **Changing The Server Port**

If another program is using port 3001, change it in your `.env` file:
```
PORT=8080
```

Then access the app at `http://localhost:8080`

---

## 🔒 Privacy & Security Features

### **Rate Limiting**
The app prevents abuse by limiting how many requests can be made in a short time. This protects your OpenAI and AWS accounts from accidental overuse.

### **File Type Validation**
Only audio files are accepted—the app checks every upload to ensure it's a valid audio format (.webm, .mp3, .wav, .ogg, .m4a).

### **Secure Cloud Storage**
Your recordings are stored in AWS S3 with:
- Encryption at rest (files are scrambled when stored)
- Unique URLs that are difficult to guess
- Access controls you can customize in your AWS dashboard

### **Environment Variables**
Sensitive information (API keys, AWS credentials) is kept in separate files that are never uploaded to GitHub or shared publicly.

---

## 📱 Technical Architecture (For The Curious)

### **Frontend (What You See)**
Built with pure HTML, CSS, and JavaScript:
- **HTML**: Structures the page layout
- **CSS**: Creates the beautiful visual design with animations
- **JavaScript**: Handles recording, playback, uploads, and user interactions

### **Backend (The Server)**
Built with Node.js and Express:
- Serves the web interface
- Handles file uploads
- Communicates with AWS S3
- Coordinates with OpenAI's API
- Manages recordings database

### **Cloud Services**
- **AWS S3**: Stores audio files permanently
- **OpenAI Whisper**: Transcribes audio to text
- **OpenAI GPT**: Generates intelligent titles

### **Audio Recording Technology**
Uses the browser's MediaRecorder API to capture audio directly from your microphone without needing any plugins or extensions.

---

## 🐛 Troubleshooting Common Issues

### **"Permission Denied" When Recording**
Your browser blocked microphone access. Click the camera/microphone icon in your browser's address bar and allow access.

### **"OpenAI API Key Not Found"**
Make sure:
1. You created a `.env` file (not `.env.example`)
2. Your API key is correctly pasted after `OPENAI_API_KEY=`
3. There are no extra spaces or quotes around the key
4. You restarted the server after creating/editing the `.env` file

### **"AWS Credentials Error"**
Check that:
1. Your CSV file is named exactly `voice-recording-api-user_accessKeys.csv`
2. The file is in the app's root folder (same place as `server.js`)
3. The CSV format matches AWS's export format

### **"Cannot Connect to Server"**
Ensure:
1. The server is running (you should see "Server running on http://localhost:3001")
2. You're visiting the correct URL in your browser
3. No other program is using port 3001

### **Recordings Upload But Don't Transcribe**
This usually means:
1. Your OpenAI API key is invalid or expired
2. You've exceeded your OpenAI usage limits
3. OpenAI's servers are temporarily down

Check your OpenAI dashboard to verify your account status and usage.

---

## 💰 Cost Considerations

### **OpenAI Pricing**
- **Whisper**: ~$0.006 per minute of audio
- **GPT Title Generation**: ~$0.0001 per title

For typical use (a few recordings per day), you'll spend less than $1 per month.

### **AWS S3 Pricing**
- **Storage**: ~$0.023 per GB per month
- **Data Transfer**: First 100GB free per month

100 hours of high-quality audio recordings uses about 1GB of storage, costing ~$0.02 per month.

**Total estimated cost**: Less than $2/month for regular personal use.

---

## 🎓 Learning More

### **Want to customize the design?**
All visual styling is in `public/styles.css`. You can change colors, fonts, animations, and layout without knowing much code.

### **Want to add features?**
- Frontend logic: `public/app.js`
- Backend logic: `server.js`
- Page structure: `public/index.html`

### **Resources to learn more:**
- [MDN Web Docs](https://developer.mozilla.org) for HTML/CSS/JavaScript
- [Node.js Documentation](https://nodejs.org/docs) for server-side development
- [AWS S3 Guide](https://docs.aws.amazon.com/s3) for cloud storage
- [OpenAI API Docs](https://platform.openai.com/docs) for AI features

---

## 📄 License

This project is open source under the ISC License, which means you're free to use, modify, and share it however you like.

---

## 🙏 Credits

This app is powered by:
- **OpenAI** for incredible AI transcription and language understanding
- **Amazon Web Services** for reliable cloud storage
- **Node.js** for the server foundation
- **The web community** for countless open-source tools and libraries

---

## 💡 Ideas For Enhancement

Some features you could add:
- Support for multiple languages in transcription
- Folders or tags to organize recordings
- Collaborative features (share recordings with specific people)
- Integration with note-taking apps
- Voice commands to control the app hands-free
- Analytics showing your recording patterns over time

---

**Enjoy recording! 🎙️✨**
