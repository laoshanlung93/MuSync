const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Multi-tenant data storage
const DATA_DIR = path.join(__dirname, 'data');
const TRACKS_LIBRARY_FILE = path.join(__dirname, 'tracks-library.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Load central track library
function loadTracksLibrary() {
  try {
    const data = fs.readFileSync(TRACKS_LIBRARY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading tracks library:', err);
    return { tracks: [] };
  }
}

function saveTracksLibrary(data) {
  try {
    fs.writeFileSync(TRACKS_LIBRARY_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving tracks library:', err);
    return false;
  }
}

function getStreamerFile(streamerId) {
  return path.join(DATA_DIR, `${streamerId}.json`);
}

function loadStreamerData(streamerId) {
  try {
    const file = getStreamerFile(streamerId);
    if (!fs.existsSync(file)) {
      return {
        streamerId,
        playlists: [
          {
            id: 'default',
            name: 'Default Playlist',
            trackIds: []
          }
        ],
        currentPlaylistId: 'default',
        currentTrackId: null,
        playbackState: {
          startTime: Date.now(),
          isPlaying: true
        }
      };
    }
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading streamer data:', err);
    return {
      streamerId,
      playlists: [{ id: 'default', name: 'Default Playlist', trackIds: [] }],
      currentPlaylistId: 'default',
      currentTrackId: null,
      playbackState: {
        startTime: Date.now(),
        isPlaying: true
      }
    };
  }
}

function saveStreamerData(streamerId, data) {
  try {
    const file = getStreamerFile(streamerId);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving streamer data:', err);
    return false;
  }
}

function getCurrentTrack(streamerId) {
  const data = loadStreamerData(streamerId);
  const library = loadTracksLibrary();
  return library.tracks.find(t => t.id === data.currentTrackId);
}

// No global playback state - each streamer has their own

// Enable CORS for Twitch Extension
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: false
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Personal Mixer Backend',
    version: '0.2.0',
    message: 'Admin dashboard available at /admin'
  });
});

// Main status endpoint - requires streamerId
app.get('/status/:streamerId', (req, res) => {
  const { streamerId } = req.params;
  const data = loadStreamerData(streamerId);
  const library = loadTracksLibrary();
  
  // Find current track in the library
  const currentTrack = library.tracks.find(t => t.id === data.currentTrackId);
  
  if (!currentTrack) {
    return res.status(404).json({ error: 'No track currently playing for this streamer' });
  }
  
  const now = Date.now();
  const elapsed = (now - data.playbackState.startTime) / 1000;
  
  const timestamp = data.playbackState.isPlaying 
    ? elapsed % currentTrack.duration 
    : 0;

  res.json({
    track_id: currentTrack.id,
    track_url: currentTrack.url,
    timestamp: parseFloat(timestamp.toFixed(2)),
    is_playing: data.playbackState.isPlaying,
    updated_at: Math.floor(now / 1000)
  });
});

// Control endpoints (for testing)
app.post('/control/:streamerId/play', (req, res) => {
  const { streamerId } = req.params;
  const data = loadStreamerData(streamerId);
  data.playbackState.isPlaying = true;
  data.playbackState.startTime = Date.now();
  saveStreamerData(streamerId, data);
  res.json({ status: 'playing' });
});

app.post('/control/:streamerId/pause', (req, res) => {
  const { streamerId } = req.params;
  const data = loadStreamerData(streamerId);
  data.playbackState.isPlaying = false;
  saveStreamerData(streamerId, data);
  res.json({ status: 'paused' });
});

// Get central track library (public)
app.get('/library/tracks', (req, res) => {
  const library = loadTracksLibrary();
  res.json(library);
});

// Admin API - Get streamer's playlists
app.get('/admin/:streamerId/playlists', (req, res) => {
  const { streamerId } = req.params;
  const data = loadStreamerData(streamerId);
  const library = loadTracksLibrary();
  
  res.json({
    playlists: data.playlists,
    currentPlaylistId: data.currentPlaylistId,
    currentTrackId: data.currentTrackId,
    library: library.tracks
  });
});

// Create new playlist
app.post('/admin/:streamerId/playlists', (req, res) => {
  const { streamerId } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Playlist name required' });
  }
  
  const data = loadStreamerData(streamerId);
  
  const newPlaylist = {
    id: `playlist_${Date.now()}`,
    name,
    trackIds: []
  };
  
  data.playlists.push(newPlaylist);
  
  if (saveStreamerData(streamerId, data)) {
    res.json(newPlaylist);
  } else {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Add track to playlist
app.post('/admin/:streamerId/playlists/:playlistId/tracks', (req, res) => {
  const { streamerId, playlistId } = req.params;
  const { trackId } = req.body;
  
  const data = loadStreamerData(streamerId);
  const playlist = data.playlists.find(p => p.id === playlistId);
  
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }
  
  if (!playlist.trackIds.includes(trackId)) {
    playlist.trackIds.push(trackId);
  }
  
  if (saveStreamerData(streamerId, data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to add track' });
  }
});

// Remove track from playlist
app.delete('/admin/:streamerId/playlists/:playlistId/tracks/:trackId', (req, res) => {
  const { streamerId, playlistId, trackId } = req.params;
  
  const data = loadStreamerData(streamerId);
  const playlist = data.playlists.find(p => p.id === playlistId);
  
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }
  
  playlist.trackIds = playlist.trackIds.filter(id => id !== trackId);
  
  if (saveStreamerData(streamerId, data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to remove track' });
  }
});

// Switch to a track
app.post('/admin/:streamerId/switch/:trackId', (req, res) => {
  const { streamerId, trackId } = req.params;
  const data = loadStreamerData(streamerId);
  const library = loadTracksLibrary();
  
  const track = library.tracks.find(t => t.id === trackId);
  
  if (!track) {
    return res.status(404).json({ error: 'Track not found in library' });
  }
  
  data.currentTrackId = trackId;
  data.playbackState.startTime = Date.now();
  
  if (saveStreamerData(streamerId, data)) {
    res.json({ success: true, track });
  } else {
    res.status(500).json({ error: 'Failed to switch track' });
  }
});

// Delete playlist
app.delete('/admin/:streamerId/playlists/:playlistId', (req, res) => {
  const { streamerId, playlistId } = req.params;
  
  const data = loadStreamerData(streamerId);
  
  if (playlistId === 'default') {
    return res.status(400).json({ error: 'Cannot delete default playlist' });
  }
  
  data.playlists = data.playlists.filter(p => p.id !== playlistId);
  
  if (data.currentPlaylistId === playlistId) {
    data.currentPlaylistId = 'default';
  }
  
  if (saveStreamerData(streamerId, data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

app.listen(PORT, () => {
  console.log(`🎧 Personal Mixer Backend running on port ${PORT}`);
  console.log(`📡 Status endpoint: http://localhost:${PORT}/status/:streamerId`);
  console.log(`🎛️  Admin API: http://localhost:${PORT}/admin/:streamerId/playlists`);
  console.log(`📚 Track library: http://localhost:${PORT}/library/tracks`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  
  const library = loadTracksLibrary();
  console.log(`🎵 ${library.tracks.length} tracks in library`);
});
