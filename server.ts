import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Mock database for songs (in a real app, this would be in Firestore)
  const songs = [
    { id: '1', title: 'Midnight City', artist: 'M83', duration: 243, url: '/api/stream/1', thumbnail: 'https://picsum.photos/seed/m83/200/200' },
    { id: '2', title: 'Starboy', artist: 'The Weeknd', duration: 230, url: '/api/stream/2', thumbnail: 'https://picsum.photos/seed/weeknd/200/200' },
    { id: '3', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, url: '/api/stream/3', thumbnail: 'https://picsum.photos/seed/blinding/200/200' },
    { id: '4', title: 'Levitating', artist: 'Dua Lipa', duration: 203, url: '/api/stream/4', thumbnail: 'https://picsum.photos/seed/dua/200/200' },
  ];

  // API Routes
  app.get('/api/songs', (req, res) => {
    res.json(songs);
  });

  app.get('/api/stream/:id', (req, res) => {
    const songId = req.params.id;
    // In a real app, we'd look up the file path from the DB
    // For this demo, we'll use a sample file if it exists, or a placeholder
    const musicDir = path.join(process.cwd(), 'music');
    if (!fs.existsSync(musicDir)) {
      fs.mkdirSync(musicDir);
    }
    
    const filePath = path.join(musicDir, `song-${songId}.mp3`);
    
    // If file doesn't exist, we'll fallback to a public sample or send 404
    if (!fs.existsSync(filePath)) {
      // Fallback to a public sample for demo purposes
      const fallbackUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      return res.redirect(fallbackUrl);
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
