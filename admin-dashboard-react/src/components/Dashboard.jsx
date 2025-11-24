import { useState, useEffect } from 'react';
import PlaylistManager from './PlaylistManager';
import TrackLibrary from './TrackLibrary';
import './Dashboard.css';

function Dashboard({ streamerId, apiUrl, onLogout }) {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState('default');
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/${streamerId}/playlists`);
      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();
      setPlaylists(data.playlists);
      setCurrentPlaylistId(data.currentPlaylistId);
      setCurrentTrackId(data.currentTrackId);
      setLibrary(data.library);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [streamerId]);

  const handleAddToPlaylist = async (trackId) => {
    try {
      const res = await fetch(`${apiUrl}/admin/${streamerId}/playlists/${currentPlaylistId}/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId })
      });
      
      if (!res.ok) throw new Error('Failed to add track');
      await loadData();
    } catch (err) {
      console.error('Error adding track:', err);
    }
  };

  const handleRemoveFromPlaylist = async (trackId) => {
    try {
      const res = await fetch(`${apiUrl}/admin/${streamerId}/playlists/${currentPlaylistId}/tracks/${trackId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to remove track');
      await loadData();
    } catch (err) {
      console.error('Error removing track:', err);
    }
  };

  const handleSwitchTrack = async (trackId) => {
    try {
      const res = await fetch(`${apiUrl}/admin/${streamerId}/switch/${trackId}`, {
        method: 'POST'
      });
      
      if (!res.ok) throw new Error('Failed to switch track');
      await loadData();
    } catch (err) {
      console.error('Error switching track:', err);
    }
  };

  const handleCreatePlaylist = async (name) => {
    try {
      const res = await fetch(`${apiUrl}/admin/${streamerId}/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      if (!res.ok) throw new Error('Failed to create playlist');
      await loadData();
      return true;
    } catch (err) {
      console.error('Error creating playlist:', err);
      return false;
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    
    try {
      const res = await fetch(`${apiUrl}/admin/${streamerId}/playlists/${playlistId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to delete playlist');
      await loadData();
    } catch (err) {
      console.error('Error deleting playlist:', err);
    }
  };

  const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
  const playlistTracks = currentPlaylist 
    ? library.filter(t => currentPlaylist.trackIds.includes(t.id))
    : [];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>🎧 Personal Mixer</h1>
          <p className="channel-name">Channel: {streamerId}</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        <PlaylistManager
          playlists={playlists}
          currentPlaylistId={currentPlaylistId}
          currentTrackId={currentTrackId}
          playlistTracks={playlistTracks}
          onSelectPlaylist={setCurrentPlaylistId}
          onCreatePlaylist={handleCreatePlaylist}
          onDeletePlaylist={handleDeletePlaylist}
          onSwitchTrack={handleSwitchTrack}
          onRemoveTrack={handleRemoveFromPlaylist}
          loading={loading}
        />
        
        <TrackLibrary
          tracks={library}
          onAddToPlaylist={handleAddToPlaylist}
          currentPlaylistId={currentPlaylistId}
        />
      </div>
    </div>
  );
}

export default Dashboard;
