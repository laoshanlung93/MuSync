// Configuration - Update this with your deployed backend URL
const API_URL = 'http://localhost:3000'; // Change to your Railway URL in production

async function loadTracks() {
  try {
    const res = await fetch(`${API_URL}/admin/tracks`);
    const data = await res.json();
    renderTracks(data);
  } catch (err) {
    console.error('Failed to load tracks:', err);
    document.getElementById('track-list').innerHTML = 
      '<li class="empty-state">⚠️ Failed to connect to backend</li>';
  }
}

function renderTracks(data) {
  const list = document.getElementById('track-list');
  
  if (data.tracks.length === 0) {
    list.innerHTML = '<li class="empty-state">No tracks yet. Add your first track above!</li>';
    return;
  }

  list.innerHTML = data.tracks.map(track => `
    <li class="track-item ${track.id === data.currentTrackId ? 'active' : ''}">
      <div class="track-info">
        <div class="track-name">
          ${track.name}
          ${track.id === data.currentTrackId ? '<span class="status-badge">Now Playing</span>' : ''}
        </div>
        <div class="track-meta">${track.duration}s • ${track.id}</div>
      </div>
      <div class="track-actions">
        ${track.id !== data.currentTrackId ? `
          <button class="btn-small btn-success" onclick="switchTrack('${track.id}')">
            Play
          </button>
        ` : ''}
        <button class="btn-small btn-danger" onclick="deleteTrack('${track.id}')">
          Delete
        </button>
      </div>
    </li>
  `).join('');
}

document.getElementById('add-track-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('track-name').value;
  const url = document.getElementById('track-url').value;
  const duration = document.getElementById('track-duration').value;

  try {
    const res = await fetch(`${API_URL}/admin/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url, duration })
    });

    if (res.ok) {
      e.target.reset();
      loadTracks();
    } else {
      alert('Failed to add track');
    }
  } catch (err) {
    console.error('Error adding track:', err);
    alert('Error adding track');
  }
});

async function switchTrack(id) {
  try {
    const res = await fetch(`${API_URL}/admin/switch/${id}`, {
      method: 'POST'
    });

    if (res.ok) {
      loadTracks();
    } else {
      alert('Failed to switch track');
    }
  } catch (err) {
    console.error('Error switching track:', err);
  }
}

async function deleteTrack(id) {
  if (!confirm('Are you sure you want to delete this track?')) return;

  try {
    const res = await fetch(`${API_URL}/admin/tracks/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      loadTracks();
    } else {
      alert('Failed to delete track');
    }
  } catch (err) {
    console.error('Error deleting track:', err);
  }
}

// Initial load and auto-refresh
loadTracks();
setInterval(loadTracks, 5000);
