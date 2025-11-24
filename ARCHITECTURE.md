# Personal Mixer - Architecture Overview

## Concept

**You** host a central library of copyright-free music on GitHub Pages.  
**Streamers** create playlists from your library and choose what plays on their channel.  
**Viewers** hear the music synced to the streamer's selection.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Central Track Library                        │
│              (You host on GitHub Pages)                          │
│  tracks-library.json: All available tracks                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend API                               │
│  - Serves track library to all streamers                         │
│  - Stores each streamer's playlists                              │
│  - Tracks current playing song per streamer                      │
└────────────┬────────────────────────────┬────────────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐    ┌──────────────────────────┐
│   Admin Dashboard      │    │   Twitch Extension       │
│   (Streamer uses)      │    │   (Viewer sees)          │
│  - Browse library      │    │  - Gets channelId        │
│  - Create playlists    │    │  - Plays current track   │
│  - Switch tracks       │    │  - Syncs every 3s        │
└────────────────────────┘    └──────────────────────────┘
```

## Components

### 1. Central Track Library (`backend/tracks-library.json`)

**You manage this file** - it contains all available tracks:

```json
{
  "tracks": [
    {
      "id": "track_001",
      "name": "Chill Vibes",
      "artist": "Your Name",
      "url": "https://yourusername.github.io/repo/audio/track1.mp3",
      "duration": 180.0,
      "genre": "Lofi",
      "tags": ["chill", "relaxing", "study"]
    }
  ]
}
```

**To add new tracks:**
1. Upload MP3 to `docs/audio/`
2. Add entry to `tracks-library.json`
3. Redeploy backend
4. All streamers can now use it!

### 2. Streamer Data (`backend/data/{channelId}.json`)

**Per-streamer storage** - each streamer has their own file:

```json
{
  "streamerId": "lao_shan_lungo",
  "playlists": [
    {
      "id": "default",
      "name": "Default Playlist",
      "trackIds": ["track_001", "track_003"]
    },
    {
      "id": "playlist_123",
      "name": "Chill Gaming",
      "trackIds": ["track_001", "track_002"]
    }
  ],
  "currentPlaylistId": "default",
  "currentTrackId": "track_001",
  "playbackState": {
    "startTime": 1732560000000,
    "isPlaying": true
  }
}
```

### 3. Backend API Endpoints

**Public:**
- `GET /library/tracks` - Get all available tracks
- `GET /status/:streamerId` - Get current playing track for a streamer

**Admin (Streamer):**
- `GET /admin/:streamerId/playlists` - Get streamer's playlists + library
- `POST /admin/:streamerId/playlists` - Create new playlist
- `POST /admin/:streamerId/playlists/:playlistId/tracks` - Add track to playlist
- `DELETE /admin/:streamerId/playlists/:playlistId/tracks/:trackId` - Remove track
- `POST /admin/:streamerId/switch/:trackId` - Switch to a track
- `DELETE /admin/:streamerId/playlists/:playlistId` - Delete playlist

### 4. Admin Dashboard (React)

**Streamer workflow:**
1. Login with Twitch channel name
2. Browse your central track library
3. Create playlists (e.g., "Chill Gaming", "Hype Mode")
4. Add tracks from library to playlists
5. Switch between tracks in real-time
6. Viewers hear the changes instantly

**Features:**
- Search tracks by name/artist
- Filter by genre
- Multiple playlists per streamer
- Real-time track switching
- Drag-and-drop (future)

### 5. Twitch Extension

**Viewer experience:**
- Extension gets streamer's channelId from Twitch API
- Calls `/status/{channelId}` every 3 seconds
- Plays the current track from your GitHub Pages
- Syncs playback position
- Volume control

## Benefits of This Architecture

### For You (Platform Owner):
✅ **Full control** - You curate the music library  
✅ **Copyright safe** - Only you upload music  
✅ **Easy updates** - Add tracks, all streamers get them  
✅ **Scalable** - One library serves unlimited streamers  

### For Streamers:
✅ **No uploads** - Just pick from your library  
✅ **Easy management** - Create playlists, switch tracks  
✅ **No storage costs** - You host everything  
✅ **Instant updates** - New tracks appear automatically  

### For Viewers:
✅ **Synced music** - Everyone hears the same thing  
✅ **Volume control** - Adjust to their preference  
✅ **No ads** - Clean listening experience  

## Scaling Considerations

### Current (MVP):
- JSON file storage
- Works for 100s of streamers
- Simple deployment

### Future (Production):
- Database (PostgreSQL/MongoDB)
- Redis caching for track library
- CDN for audio files (CloudFlare)
- User authentication (Twitch OAuth)
- Analytics dashboard
- Track usage statistics

## Adding New Tracks

**Your workflow:**

1. **Get copyright-free music:**
   - Epidemic Sound
   - Artlist
   - YouTube Audio Library
   - Royalty-free sites

2. **Upload to GitHub Pages:**
   ```bash
   # Add to docs/audio/
   git add docs/audio/new-track.mp3
   git commit -m "Add new track"
   git push
   ```

3. **Update library:**
   ```bash
   # Edit backend/tracks-library.json
   {
     "id": "track_003",
     "name": "Epic Gaming",
     "artist": "Your Name",
     "url": "https://yourusername.github.io/repo/audio/new-track.mp3",
     "duration": 200.0,
     "genre": "Electronic",
     "tags": ["gaming", "energetic", "epic"]
   }
   ```

4. **Redeploy backend:**
   ```bash
   git push  # Railway auto-deploys
   ```

5. **Done!** All streamers see the new track in their library.

## Monetization Ideas

- **Free tier:** 10 tracks, 1 playlist
- **Pro tier ($5/mo):** Full library, unlimited playlists
- **Premium tracks:** Exclusive music for paid users
- **Custom uploads:** Let streamers upload (with moderation)
- **Bits integration:** Unlock tracks with Twitch Bits

## Next Steps

1. ✅ Backend with playlist support
2. ✅ React admin dashboard
3. ✅ Multi-tenant architecture
4. 🔄 Test locally
5. 🔄 Deploy to production
6. 🔄 Add more tracks to library
7. 🔄 Beta test with streamers
8. 🔄 Submit Twitch Extension for review
