# Personal Mixer Backend

Backend API for the Personal Mixer Twitch Extension MVP.

## Setup

```bash
npm install
npm start
```

For development with auto-reload (Node 18+):
```bash
npm run dev
```

## Endpoints

### `GET /status`
Returns current track playback state.

**Response:**
```json
{
  "track_id": "example_01",
  "track_url": "https://cdn.example.com/audio/example_01.mp3",
  "timestamp": 42.5,
  "is_playing": true,
  "updated_at": 1732560000
}
```

### `POST /control/play`
Start playback (testing only).

### `POST /control/pause`
Pause playback (testing only).

## Configuration

Update the `TRACK` object in `server.js`:
- `url`: Your CDN URL for the MP3 file
- `duration`: Track length in seconds

## Deployment

Deploy to Railway, Render, or Vercel. Make sure to:
1. Set environment variable `PORT` (usually auto-configured)
2. Update `TRACK.url` with your actual CDN URL
3. Enable HTTPS (required for Twitch Extensions)
