import { useState } from 'react';
import './AddTrackForm.css';

function AddTrackForm({ onAdd }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onAdd({
      name,
      url,
      duration: parseFloat(duration)
    });
    
    if (success) {
      setName('');
      setUrl('');
      setDuration('');
    }
    
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Add New Track</h2>
      <form onSubmit={handleSubmit} className="add-track-form">
        <div className="form-group">
          <label>Track Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Song"
            required
          />
        </div>
        
        <div className="form-group">
          <label>MP3 URL (GitHub Pages)</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://username.github.io/repo/audio/song.mp3"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="180"
            step="0.1"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Track'}
        </button>
      </form>
    </div>
  );
}

export default AddTrackForm;
