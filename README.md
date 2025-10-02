# Voice Recording Web App

A complete, production-ready voice recording web application with AWS S3 storage integration. Record audio directly from your browser, upload to S3, and generate shareable links instantly.

## Features

- 🎙️ **High-Quality Recording** - WebM/Opus codec at 128kbps for optimal quality
- 📊 **Real-Time Visualization** - Audio level visualization during recording and playback
- ☁️ **Cloud Storage** - Direct browser-to-S3 uploads using presigned URLs
- 🔗 **Shareable Links** - Instantly generate public URLs for your recordings
- 🎨 **Modern UI** - Responsive design with dark/light theme support
- 🎵 **Advanced Playback** - Custom audio player with waveform, speed control, and volume adjustment
- 📱 **Mobile-First** - Touch-friendly controls and responsive layout
- ♿ **Accessible** - ARIA labels, keyboard navigation, and screen reader support

## AWS S3 Configuration

This application is pre-configured to work with the following AWS S3 setup:

- **Bucket Name**: `voice-recording-app`
- **Region**: `us-east-1` (US East N. Virginia)
- **Shareable URL Format**: `https://voice-recording-app.s3.amazonaws.com/shared/[filename]`

### Folder Structure
- `uploads/` - Temporary upload location
- `shared/` - Publicly accessible files for sharing

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Modern web browser** (Chrome, Firefox, Edge, Safari)
- **AWS Credentials** - Already included in `voice-recording-api-user_accessKeys.csv`

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### 3. Open the Application

Navigate to [http://localhost:3001](http://localhost:3001) in your web browser.

## Usage

### Recording Audio

1. **Click the record button** (large blue microphone icon)
2. **Allow microphone access** when prompted by your browser
3. **Watch the visualization** as you record
4. **Click the stop button** when finished
5. **Wait for upload** - Progress bar shows upload status
6. **Recording saved!** - Your recording is now in the list below

### Playing Recordings

1. **Click the play button** on any recording in the list
2. **Use the audio player** controls:
   - Play/Pause button
   - Seek bar for navigation
   - Speed control (0.5x - 2x)
   - Volume control
3. **View waveform** visualization in real-time

### Sharing Recordings

1. **Click the share button** (upload icon) on any recording
2. **Link copied!** - The shareable URL is now in your clipboard
3. **Share the link** - Anyone with the link can access the recording

### Deleting Recordings

1. **Click the delete button** (trash icon) on any recording
2. **Confirm deletion** in the modal dialog
3. **Recording removed** - File is deleted from S3 and the list

## File Structure

```
voice-recording-app/
├── server.js                 # Express API server with S3 integration
├── package.json              # Dependencies and scripts
├── voice-recording-api-user_accessKeys.csv  # AWS credentials
├── public/
│   ├── index.html           # Main application interface
│   ├── styles.css           # Responsive styling and themes
│   ├── app.js               # Application orchestration
│   ├── recorder.js          # MediaRecorder API wrapper
│   ├── uploader.js          # S3 upload handling
│   └── player.js            # Audio playback controls
└── README.md                # This file
```

## API Endpoints

The backend server provides the following REST API endpoints:

### `POST /api/get-upload-url`
Generate a presigned URL for uploading audio files to S3.

**Request Body:**
```json
{
  "filename": "recording_2024-01-01.webm",
  "contentType": "audio/webm"
}
```

**Response:**
```json
{
  "uploadUrl": "https://voice-recording-app.s3.amazonaws.com/...",
  "key": "uploads/recording_2024-01-01.webm",
  "filename": "recording_2024-01-01.webm"
}
```

### `POST /api/move-to-shared`
Move a file from `uploads/` to `shared/` folder and make it publicly accessible.

**Request Body:**
```json
{
  "filename": "recording_2024-01-01.webm"
}
```

**Response:**
```json
{
  "success": true,
  "shareableUrl": "https://voice-recording-app.s3.amazonaws.com/shared/recording_2024-01-01.webm",
  "filename": "recording_2024-01-01.webm"
}
```

### `GET /api/recordings`
List all recordings in the `shared/` folder.

**Response:**
```json
{
  "recordings": [
    {
      "filename": "recording_2024-01-01.webm",
      "key": "shared/recording_2024-01-01.webm",
      "size": 245632,
      "lastModified": "2024-01-01T12:00:00.000Z",
      "url": "https://voice-recording-app.s3.amazonaws.com/shared/recording_2024-01-01.webm"
    }
  ]
}
```

### `DELETE /api/recordings/:filename`
Delete a recording from the `shared/` folder.

**Response:**
```json
{
  "success": true,
  "message": "Recording deleted successfully"
}
```

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "bucket": "voice-recording-app",
  "region": "us-east-1"
}
```

## Configuration

### AWS Credentials

The application reads AWS credentials from `voice-recording-api-user_accessKeys.csv`. This file contains:

- Access Key ID
- Secret Access Key

**⚠️ IMPORTANT**: Never commit this file to version control. It's already added to `.gitignore`.

### Environment Variables (Optional)

You can override the default configuration by setting environment variables:

```bash
export AWS_REGION=us-east-1
export S3_BUCKET_NAME=voice-recording-app
export PORT=3001
```

## Security Features

- ✅ **Presigned URLs** with 15-minute expiration
- ✅ **File type validation** (audio files only)
- ✅ **Filename sanitization** to prevent path traversal
- ✅ **Rate limiting** (100 requests per 15 minutes per IP)
- ✅ **CORS configuration** for browser security
- ✅ **CSRF protection** headers

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 49+ | Full support |
| Firefox | 25+ | Full support |
| Edge | 79+ | Full support |
| Safari | 14+ | Full support |
| Opera | 36+ | Full support |

## Troubleshooting

### Microphone Permission Denied
- Check browser permissions in settings
- Ensure you're using HTTPS (or localhost for development)
- Try a different browser

### Upload Fails
- Check your internet connection
- Verify AWS credentials are correct
- Ensure S3 bucket exists and has proper CORS configuration

### No Audio Playback
- Check if the file was uploaded successfully
- Verify the file format is supported
- Try downloading and playing the file locally

### Server Won't Start
- Ensure port 3000 is not in use
- Verify AWS credentials file exists
- Check Node.js version (must be 18+)

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` for automatic server restart on file changes.

### Testing Locally

1. Start the server: `npm start`
2. Open browser: `http://localhost:3001`
3. Test recording, uploading, and playback
4. Check browser console for errors
5. Monitor server logs for backend issues

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update AWS credentials for production environment
- [ ] Configure HTTPS/TLS certificate
- [ ] Set up proper CORS origins
- [ ] Enable CloudFront for CDN (optional)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for S3 bucket

### Deployment Steps

1. **Install dependencies**:
   ```bash
   npm install --production
   ```

2. **Set environment variables**:
   ```bash
   export NODE_ENV=production
   export PORT=3001
   ```

3. **Start with process manager** (e.g., PM2):
   ```bash
   npm install -g pm2
   pm2 start server.js --name voice-recorder
   pm2 save
   pm2 startup
   ```

## License

ISC

## Support

For issues, questions, or contributions, please open an issue on the project repository.

## Credits

Built with:
- [Express.js](https://expressjs.com/) - Web framework
- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/) - S3 integration
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) - Audio recording
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Audio visualization

---

**Ready to record!** 🎙️ Start the server and begin creating voice recordings.
