import './TrackList.css';

function TrackList({ tracks, currentTrackId, onSwitch, onDelete, loading }) {
  if (loading) {
    return (
      <div className="card">
        <h2>Track Library</h2>
        <div className="empty-state">Loading tracks...</div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="card">
        <h2>Track Library</h2>
        <div className="empty-state">
          No tracks yet. Add your first track above!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Track Library</h2>
      <ul className="track-list">
        {tracks.map(track => (
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
                {track.duration}s • {track.id}
              </div>
            </div>
            
            <div className="track-actions">
              {track.id !== currentTrackId && (
                <button 
                  className="btn-small btn-success"
                  onClick={() => onSwitch(track.id)}
                >
                  Play
                </button>
              )}
              <button 
                className="btn-small btn-danger"
                onClick={() => onDelete(track.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackList;
