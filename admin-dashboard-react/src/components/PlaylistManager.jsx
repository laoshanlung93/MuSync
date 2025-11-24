import { useState } from 'react';
import './PlaylistManager.css';

function PlaylistManager({ 
  playlists, 
  currentPlaylistId, 
  currentTrackId,
  playlistTracks,
  onSelectPlaylist, 
  onCreatePlaylist,
  onDeletePlaylist,
  onSwitchTrack,
  onRemoveTrack,
  loading 
}) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const success = await onCreatePlaylist(newPlaylistName);
    if (success) {
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);

  return (
    <div className="card">
      <div className="playlist-header">
        <h2>📝 Playlists</h2>
        <button 
          className="btn-small"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ New Playlist'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="create-playlist-form">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name..."
            required
            autoFocus
          />
          <button type="submit">Create</button>
        </form>
      )}

      <div className="playlist-tabs">
        {playlists.map(playlist => (
          <button
            key={playlist.id}
            className={`playlist-tab ${playlist.id === currentPlaylistId ? 'active' : ''}`}
            onClick={() => onSelectPlaylist(playlist.id)}
          >
            {playlist.name}
            {playlist.id !== 'default' && (
              <span 
                className="delete-playlist"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePlaylist(playlist.id);
                }}
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="playlist-content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : playlistTracks.length === 0 ? (
          <div className="empty-state">
            No tracks in this playlist. Add tracks from the library below!
          </div>
        ) : (
          <ul className="track-list">
            {playlistTracks.map(track => (
              <li 
                key={track.id}
                className={`track-item ${track.id === currentTrackId ? 'active' : ''}`}
              >
                <div className="track-info">
                  <div className="track-name">
                    {track.name}
                    {track.id === currentTrackId && (
                      <span className="status-badge">Now Playing</span>
                    )}
                  </div>
                  <div className="track-meta">
                    {track.artist} • {track.duration}s • {track.genre}
                  </div>
                </div>
                
                <div className="track-actions">
                  {track.id !== currentTrackId && (
                    <button 
                      className="btn-small btn-success"
                      onClick={() => onSwitchTrack(track.id)}
                    >
                      Play
                    </button>
                  )}
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => onRemoveTrack(track.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PlaylistManager;
