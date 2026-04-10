import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  thumbnail: string;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  closePlayer: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration && isFinite(audio.duration)) {
        const newProgress = (audio.currentTime / audio.duration) * 100;
        if (isFinite(newProgress)) {
          setProgress(newProgress);
        }
      }
    };

    const handleEnded = () => {
      nextSong();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && isFinite(volume)) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  const playSong = (song: Song) => {
    if (audioRef.current) {
      if (currentSong?.id === song.id) {
        togglePlay();
      } else {
        audioRef.current.src = song.url;
        audioRef.current.play().catch(console.error);
        setCurrentSong(song);
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex]);
  };

  const prevSong = () => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex]);
  };

  const seek = (value: number) => {
    if (audioRef.current && audioRef.current.duration && isFinite(audioRef.current.duration) && isFinite(value)) {
      const time = (value / 100) * audioRef.current.duration;
      if (isFinite(time)) {
        audioRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const setVolume = (value: number) => {
    if (isFinite(value)) {
      setVolumeState(Math.max(0, Math.min(1, value)));
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      progress,
      volume,
      playSong,
      togglePlay,
      nextSong,
      prevSong,
      seek,
      setVolume,
      playlist,
      setPlaylist,
      closePlayer
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};
