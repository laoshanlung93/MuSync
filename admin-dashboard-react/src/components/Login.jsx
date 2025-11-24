import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [channelName, setChannelName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channelName.trim()) {
      onLogin(channelName.toLowerCase().trim());
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🎧 Personal Mixer</h1>
        <p className="subtitle">Streamer Dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Twitch Channel Name</label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="your_channel_name"
              required
              autoFocus
            />
            <small>Enter your Twitch channel name to manage your music</small>
          </div>
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
