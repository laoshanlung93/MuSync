# Personal Mixer - Admin Dashboard

Web interface for streamers to manage their music tracks.

## Setup

### Local Development

1. Update `app.js` line 2 with your backend URL:
   ```javascript
   const API_URL = 'http://localhost:3000';
   ```

2. Open `index.html` in your browser

### Production Deployment

**Option 1: Deploy to Netlify/Vercel**
1. Update `API_URL` in `app.js` to your Railway backend URL
2. Deploy this folder to Netlify or Vercel
3. Share the URL with streamers

**Option 2: Serve from Backend**
1. Copy files to `backend/public/`
2. Access at your backend URL root

## Features

- **Add Tracks**: Enter track name, MP3 URL, and duration
- **Switch Tracks**: Click "Play" to make a track active
- **Delete Tracks**: Remove unwanted tracks
- **Live Updates**: Dashboard refreshes every 5 seconds
- **Now Playing**: See which track is currently active

## Usage

1. Add your MP3 files to GitHub Pages (`docs/audio/`)
2. Copy the full URL (e.g., `https://username.github.io/repo/audio/song.mp3`)
3. Get the track duration in seconds
4. Add track via the form
5. Click "Play" to switch to that track
6. Viewers will automatically hear the new track!
