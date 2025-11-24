# Personal Mixer - Twitch Extension

Client-side widget for the Personal Mixer MVP.

## Files

- `panel.html` - Panel view (below stream)
- `overlay.html` - Video overlay view
- `player.js` - Sync logic and audio playback
- `styles.css` - Styling for both views
- `config.json` - Extension configuration

## Setup

### 1. Update Backend URL

Edit `player.js` line 2:
```javascript
const BACKEND_URL = 'https://your-backend-url.com';
```

### 2. Test Locally

Open `panel.html` in your browser to test the widget.

**Note:** You'll need to run a local server due to CORS:
```bash
# Python 3
python3 -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then visit: `http://localhost:8000/panel.html`

### 3. Deploy to Twitch

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/extensions)
2. Create a new extension
3. Upload these files as extension assets
4. Configure panel and overlay views
5. Test in Twitch Developer Rig
6. Submit for review

## Testing Checklist

- [ ] Audio loads and plays
- [ ] Timestamp syncs every 3 seconds
- [ ] Drift correction works (< 0.5s tolerance)
- [ ] Works in both panel and overlay modes
- [ ] Handles backend downtime gracefully
- [ ] Autoplay works (or shows click prompt)

## Configuration

### Sync Settings (player.js)

- `SYNC_INTERVAL`: How often to poll backend (default: 3000ms)
- `DRIFT_TOLERANCE`: Max drift before correction (default: 0.5s)

### CORS Requirements

Your backend must allow requests from:
- `https://*.ext-twitch.tv` (Twitch Extension domain)
- Your local testing domain

## Troubleshooting

**Audio won't play:**
- Check browser autoplay policies
- User must interact with page first
- Check CORS headers on backend

**Drift issues:**
- Increase `DRIFT_TOLERANCE`
- Check network latency
- Verify backend timestamp accuracy

**Connection errors:**
- Verify backend URL is HTTPS
- Check CORS configuration
- Ensure backend is deployed and accessible
