# Personal Mixer - Admin Dashboard (React)

Modern React admin dashboard for streamers to manage their music tracks.

## Features

- **Multi-tenant**: Each streamer has their own track library
- **Login with Channel Name**: Streamers enter their Twitch channel name
- **Track Management**: Add, switch, and delete tracks
- **Real-time Updates**: Dashboard auto-refreshes every 5 seconds
- **Responsive Design**: Works on desktop and mobile

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:3000
```

For production:
```
VITE_API_URL=https://your-backend.up.railway.app
```

## Build for Production

```bash
npm run build
```

The `dist/` folder can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

## Deployment

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm run build
vercel --prod
```

### GitHub Pages
1. Build: `npm run build`
2. Copy `dist/` contents to your repo
3. Enable GitHub Pages

## Usage

1. Streamer visits the dashboard URL
2. Enters their Twitch channel name (e.g., "lao_shan_lungo")
3. Manages their tracks
4. Viewers on their Twitch channel hear the selected music

## Architecture

- **Frontend**: React + Vite
- **Backend**: Node.js Express API
- **Storage**: JSON files per streamer (backend/data/{channelId}.json)
- **Extension**: Vanilla JS (gets channelId from Twitch API)
