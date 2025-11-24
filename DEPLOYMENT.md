# Personal Mixer - Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Personal Mixer System                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   Streamer   │─────▶│    Admin     │─────▶│  Backend  │ │
│  │  Dashboard   │      │  Dashboard   │      │    API    │ │
│  │   (React)    │      │   (React)    │      │ (Node.js) │ │
│  └──────────────┘      └──────────────┘      └─────┬─────┘ │
│                                                      │        │
│                                                      │        │
│  ┌──────────────┐                                   │        │
│  │   Viewer     │                                   │        │
│  │  Extension   │───────────────────────────────────┘        │
│  │  (Twitch)    │                                            │
│  └──────────────┘                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Backend API (Node.js)
**Location:** `backend/`
**Purpose:** Multi-tenant API serving track data per streamer
**Deploy to:** Railway

**Steps:**
1. Push code to GitHub
2. Connect Railway to your repo
3. Set root directory to `backend/`
4. Railway auto-deploys
5. Note your URL: `https://your-app.up.railway.app`

**Environment:**
- `PORT`: Auto-configured by Railway
- No other env vars needed

### 2. Admin Dashboard (React)
**Location:** `admin-dashboard-react/`
**Purpose:** Streamer interface to manage tracks
**Deploy to:** Netlify or Vercel

**Steps:**
```bash
cd admin-dashboard-react
npm install
npm run build
```

**Netlify:**
```bash
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
vercel --prod
```

**Environment Variables:**
- `VITE_API_URL`: Your Railway backend URL

### 3. Twitch Extension
**Location:** `extension/`
**Purpose:** Viewer-side music player
**Deploy to:** Twitch Extension Asset Hosting

**Steps:**
1. Update `player.js` line 2 with Railway URL
2. Upload files to Twitch Developer Console:
   - panel.html
   - overlay.html
   - player.js
   - styles.css
3. Configure Extension Views
4. Move to Hosted Test
5. Submit for Review

### 4. Audio Files
**Location:** `docs/audio/`
**Purpose:** MP3 storage
**Deploy to:** GitHub Pages

**Steps:**
1. Add MP3 files to `docs/audio/`
2. Enable GitHub Pages (Settings → Pages → Source: main branch, /docs folder)
3. URLs: `https://username.github.io/repo/audio/filename.mp3`

## Multi-Tenant Flow

1. **Streamer logs in** to Admin Dashboard with their Twitch channel name
2. **Adds tracks** via the dashboard
3. **Backend stores** tracks in `backend/data/{channelId}.json`
4. **Viewer watches** stream on Twitch
5. **Extension gets** channelId from Twitch API
6. **Extension calls** `/status/{channelId}` to get current track
7. **Music plays** synced for that specific streamer

## Testing Locally

### Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:3000
```

### Admin Dashboard
```bash
cd admin-dashboard-react
npm install
npm run dev
# Runs on http://localhost:5173
```

### Extension
```bash
cd extension
python3 -m http.server 8080
# Open http://localhost:8080/panel.html
```

## Production URLs

After deployment, update these:

1. **Extension** (`extension/player.js` line 2):
   ```javascript
   const BACKEND_URL = 'https://your-backend.up.railway.app';
   ```

2. **Admin Dashboard** (`.env`):
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```

3. **Twitch Extension Capabilities**:
   - Allowlist for URL Fetching: `https://your-backend.up.railway.app`
   - Allowlist for Media: `https://username.github.io`

## Data Storage

Each streamer's data is stored in:
```
backend/data/{channelId}.json
```

Example:
```json
{
  "streamerId": "lao_shan_lungo",
  "tracks": [
    {
      "id": "track_1234567890",
      "name": "Cool Song",
      "url": "https://username.github.io/repo/audio/song.mp3",
      "duration": 180.5
    }
  ],
  "currentTrackId": "track_1234567890",
  "playbackState": {
    "startTime": 1732560000000,
    "isPlaying": true
  }
}
```

## Next Steps

1. Deploy backend to Railway
2. Deploy admin dashboard to Netlify/Vercel
3. Update extension with production URLs
4. Upload extension to Twitch
5. Test with your channel
6. Submit extension for Twitch review
7. Share admin dashboard URL with other streamers!
