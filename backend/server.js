const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Track configuration
const TRACK = {
  id: 'example_01',
  url: 'https://cdn.example.com/audio/example_01.mp3', // Replace with your CDN URL
  duration: 120.0 // Track length in seconds
};

// Playback state
let playbackState = {
  startTime: Date.now(),
  isPlaying: true
};

// Enable CORS for Twitch Extension
app.use(cors({
  origin: '*', // For MVP - restrict this in production
  methods: ['GET']
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Personal Mixer Backend',
    version: '0.1.0'
  });
});

// Main status endpoint
app.get('/status', (req, res) => {
  const now = Date.now();
  const elapsed = (now - playbackState.startTime) / 1000; // Convert to seconds
  
  // Calculate current timestamp with looping
  const timestamp = playbackState.isPlaying 
    ? elapsed % TRACK.duration 
    : 0;

  res.json({
    track_id: TRACK.id,
    track_url: TRACK.url,
    timestamp: parseFloat(timestamp.toFixed(2)),
    is_playing: playbackState.isPlaying,
    updated_at: Math.floor(now / 1000)
  });
});

// Control endpoints (for testing)
app.post('/control/play', (req, res) => {
  playbackState.isPlaying = true;
  playbackState.startTime = Date.now();
  res.json({ status: 'playing' });
});

app.post('/control/pause', (req, res) => {
  playbackState.isPlaying = false;
  res.json({ status: 'paused' });
});

app.listen(PORT, () => {
  console.log(`🎧 Personal Mixer Backend running on port ${PORT}`);
  console.log(`📡 Status endpoint: http://localhost:${PORT}/status`);
  console.log(`🎵 Track: ${TRACK.id} (${TRACK.duration}s)`);
});
