# Spotify Clone - Full Stack Music Streaming App

A complete music streaming application built with React, Express, and Firebase.

## Features
- **User Authentication**: Google Login via Firebase Auth.
- **Music Streaming**: Backend streaming with range headers (supports seeking).
- **Spotify UI**: Modern dark theme with sidebar, player, and song cards.
- **Playlists**: Create and manage playlists (stored in Firestore).
- **Responsive Design**: Works on desktop and mobile.

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: Firebase Firestore.
- **Auth**: Firebase Authentication.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Music Files
The server looks for MP3 files in the `/music` directory at the root.
- Create a folder named `music` in the project root.
- Add files named `song-1.mp3`, `song-2.mp3`, etc.
- If no local files are found, the app will fallback to a public sample URL for demo purposes.

### 3. Run the App
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## API Endpoints
- `GET /api/songs`: Returns a list of available songs.
- `GET /api/stream/:id`: Streams the audio file for the given song ID.

## Portability
This app is designed to be easily deployable to Vercel or Cloud Run.
- For Vercel, ensure you have the Firebase environment variables set up.
- The `server.ts` handles both API routes and static file serving for production.
