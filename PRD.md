🎧 Personal Mixer MVP — Product Requirements Document (PRD)

Version: 0.1
Author: ChatGPT
Status: Draft
Scope: Backend + Twitch Extension Widget (Viewer-Side)
MVP Goal: One example track synced between backend and widget

1. Overview

Personal Mixer is a Twitch Extension that allows viewers to hear music synced with what the streamer has chosen.
For the MVP, the streamer will not have a dashboard. Instead, we will hardcode a single track and expose it via the backend.

The Twitch Extension widget will:

Poll the backend for the current track + timestamp

Play the audio file client-side

Seek to the correct timestamp

Stay in sync with the backend every few seconds

No streamer-side UI is required yet.

2. Goals & Non-Goals
Goals (MVP)

Build a backend service that exposes:

Current track ID

Audio file URL

Current playback timestamp

Build a Twitch Extension widget that:

Loads the backend state

Plays the audio file in sync

Continues playback with periodic resync

Maintain a single example track in CDN/static hosting

Work in both overlay + panel extension modes

Non-Goals (Future)

Streamer dashboard

Multiple playlists

Bits monetization

Scene-based audio changes

Volume sliders

Multi-track libraries

User accounts

Real-time websockets

OBS integration

3. System Architecture
+----------------------------+
|  Backend API (Node/Python)|
|  /status endpoint          |
+-------------+--------------+
              |
   Poll every 3–5 seconds
              |
+-------------v--------------+
| Twitch Extension (Widget) |
| HTML + JS + Twitch SDK    |
| Loads audio client-side    |
+-------------+--------------+
              |
         Audio File
              |
+-------------v--------------+
|     CDN / Static Storage   |
|   example-track.mp3        |
+----------------------------+

4. Backend Requirements
4.1 Technology

(Node.js or Python only for MVP)

4.2 Endpoints
GET /status

Returns the current track info.

Example response:
{
  "track_id": "example_01",
  "track_url": "https://cdn.example.com/audio/example_01.mp3",
  "timestamp": 42.5,
  "is_playing": true,
  "updated_at": 1732560000
}

Field definitions:
Field	Type	Description
track_id	string	Unique identifier
track_url	string	Direct MP3 URL
timestamp	float	Seconds into the track
is_playing	boolean	If true, audio should play
updated_at	unix timestamp	Last update time
4.3 Backend Logic
MVP Playback Logic:

Backend stores an internal clock starting at 0.0 (track start)

Each second, backend increments timestamp (e.g. via cron, internal loop)

/status returns the current timestamp

Required Behavior:

When timestamp reaches track length (e.g. 120s), loop to 0

Backend should return consistent, monotonic timestamps

No Authentication Needed (MVP)

Twitch Extension can call backend anonymously.

5. Audio File
Requirements:

Format: .mp3

Duration: 30–180 seconds

Hosted on:

AWS S3 + CloudFront

GitHub Pages

Supabase Storage

Any CDN with public access

Example:
https://cdn.example.com/audio/example_01.mp3

6. Twitch Extension Widget Requirements
6.1 Tech Stack

Vanilla JS or lightweight React

Must run inside Twitch Extension iframe

Must follow Twitch Extension sandbox policies

Must use HTTPS

6.2 Widget Behavior
On Load:

Call /status

Preload audio element with track_url

Seek to timestamp

Start playback

While Running:

Poll /status every 3 seconds

Check if drift > 0.5 seconds

If so: re-seek to correct timestamp

Handle is_playing = false (pause)

6.3 Audio Requirements

Use <audio> element:

<audio id="pm-audio" preload="auto"></audio>


JS pseudo-logic:

const audio = document.getElementById("pm-audio");

async function sync() {
  const status = await fetch("/status").then(r => r.json());

  if (audio.src !== status.track_url) {
    audio.src = status.track_url;
    await audio.load();
  }

  const drift = Math.abs(audio.currentTime - status.timestamp);

  if (drift > 0.5) {
    audio.currentTime = status.timestamp;
  }

  if (status.is_playing && audio.paused) {
    audio.play();
  }
}
setInterval(sync, 3000);

6.4 UI Requirements (MVP)

Simple text:

“Playing Example Track”

Current timestamp (optional)

No buttons

No interactivity

Fullwidth black or transparent background

7. Sync Logic Requirements
Target drift tolerance:

<= 0.5 seconds

Periodic polling + correction is acceptable for MVP

When switching track (future):

Widget resets audio source

Seeks to new timestamp instantly

8. Testing Requirements
Backend Tests:

Timestamp increments correctly

Returns valid JSON

Handles track loop

Served over HTTPS

Widget Tests:

Loads audio and plays from correct timestamp

Resyncs after drift

Handles backend downtime

Works in Twitch Developer Rig

9. MVP Delivery Checklist
Backend

 /status endpoint working

 Timestamp increments

 Track loops

 CORS enabled

 Deployed over HTTPS

Audio

 1 example MP3 uploaded to CDN

 Publicly accessible

Widget

 Loads backend state

 Plays track

 Syncs every 3 seconds

 Works inside Twitch Extension iframe

 Minimal UI

10. Future Expansion (Non-MVP)

Multi-track playlists

Streamer dashboard to choose music

Bit monetization

Theme packs

Scene-based mood switching

Viewer volume control

Real-time push (WebSockets)

Twitch OAuth