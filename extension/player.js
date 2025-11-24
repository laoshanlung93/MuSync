// Configuration
const BACKEND_URL = 'https://musync-production.up.railway.app'; // Update this with your deployed backend URL
const SYNC_INTERVAL = 3000; // 3 seconds
const DRIFT_TOLERANCE = 0.5; // 0.5 seconds

// Get streamer channel ID from Twitch
let channelId = null;

// Initialize Twitch Extension Helper
if (window.Twitch && window.Twitch.ext) {
  window.Twitch.ext.onAuthorized((auth) => {
    channelId = auth.channelId;
    console.log('Twitch channel ID:', channelId);
  });
}

// Elements (will be initialized after DOM loads)
let audio;
let trackNameEl;
let timestampEl;
let playBtn;

// State
let currentTrackId = null;
let syncIntervalId = null;

// Format seconds to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Main sync function
async function sync() {
  if (!channelId) {
    console.warn('Channel ID not available yet');
    return;
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/status/${channelId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const status = await response.json();
    
    // Update track name
    if (trackNameEl) {
      trackNameEl.textContent = `Playing: ${status.track_id}`;
    }
    
    // Update timestamp display
    if (timestampEl) {
      timestampEl.textContent = formatTime(status.timestamp);
    }
    
    // Load new track if changed
    if (currentTrackId !== status.track_id) {
      console.log('Loading new track:', status.track_id);
      currentTrackId = status.track_id;
      audio.src = status.track_url;
      await audio.load();
    }
    
    // Check drift and correct if needed
    const drift = Math.abs(audio.currentTime - status.timestamp);
    
    if (drift > DRIFT_TOLERANCE) {
      console.log(`Correcting drift: ${drift.toFixed(2)}s`);
      audio.currentTime = status.timestamp;
    }
    
    // Don't auto-play, just keep in sync when playing
    // User controls playback with the button
    
  } catch (error) {
    console.error('Sync error:', error);
    if (trackNameEl) {
      trackNameEl.textContent = '⚠️ Connection error';
    }
  }
}

// Initialize
async function init() {
  console.log('Personal Mixer initializing...');
  
  // Get elements after DOM is ready
  audio = document.getElementById('pm-audio');
  trackNameEl = document.getElementById('track-name');
  timestampEl = document.getElementById('timestamp');
  playBtn = document.getElementById('play-btn');
  
  console.log('Elements found:', {
    audio: !!audio,
    trackName: !!trackNameEl,
    timestamp: !!timestampEl,
    playBtn: !!playBtn
  });
  
  // Initial sync
  await sync();
  
  // Start periodic sync
  syncIntervalId = setInterval(sync, SYNC_INTERVAL);
  
  // Set initial volume
  if (audio) {
    audio.volume = 0.5; // 50%
  }

  // Handle play/pause button click
  if (playBtn) {
    playBtn.addEventListener('click', async () => {
      if (!audio.src) return;
      
      try {
        if (audio.paused) {
          await audio.play();
          playBtn.textContent = '⏸️ Pause';
          console.log('Playback started');
        } else {
          audio.pause();
          playBtn.textContent = '▶️ Play';
          console.log('Playback paused');
        }
      } catch (err) {
        console.error('Play/Pause failed:', err);
        playBtn.textContent = '❌ Error';
      }
    });
  }

  // Handle volume slider
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');
  
  if (volumeSlider && audio) {
    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      audio.volume = volume;
      if (volumeValue) {
        volumeValue.textContent = `${e.target.value}%`;
      }
    });
  }
}

// Start when DOM is ready
console.log('Document ready state:', document.readyState);
console.log('Body HTML length:', document.body ? document.body.innerHTML.length : 'no body');

if (document.readyState === 'loading') {
  console.log('Waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', init);
} else {
  console.log('DOM already loaded, initializing...');
  init();
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
  }
});
