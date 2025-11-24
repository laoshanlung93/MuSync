import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [channelId, setChannelId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channelId.trim()) {
      onLogin(channelId.trim());
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🎧 Personal Mixer</h1>
        <p className="subtitle">Streamer Dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Twitch Channel ID</label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="88643587"
              required
              autoFocus
            />
            <small>Find your Channel ID at <a href="https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/" target="_blank" rel="noopener noreferrer" style={{color: '#00d9ff'}}>this tool</a></small>
          </div>
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
