import { useState } from 'react';
import './TrackLibrary.css';

function TrackLibrary({ tracks, onAddToPlaylist, currentPlaylistId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genres = ['all', ...new Set(tracks.map(t => t.genre))];

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="card">
      <h2>🎵 Track Library</h2>
      
      <div className="library-filters">
        <input
          type="text"
          placeholder="Search tracks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="genre-select"
        >
          {genres.map(genre => (
            <option key={genre} value={genre}>
              {genre === 'all' ? 'All Genres' : genre}
            </option>
          ))}
        </select>
      </div>

      <div className="library-tracks">
        {filteredTracks.map(track => (
          <div key={track.id} className="library-track">
            <div className="library-track-info">
              <div className="library-track-name">{track.name}</div>
              <div className="library-track-meta">
                {track.artist} • {track.duration}s • {track.genre}
              </div>
            </div>
            <button
              className="btn-small btn-add"
              onClick={() => onAddToPlaylist(track.id)}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackLibrary;
