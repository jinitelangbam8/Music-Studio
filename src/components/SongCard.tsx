import React from 'react';
import { Play } from 'lucide-react';
import { Song, useMusic } from '@/lib/MusicContext';

interface SongCardProps {
  song: Song;
}

export const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const { playSong, currentSong, isPlaying } = useMusic();
  const isActive = currentSong?.id === song.id;

  return (
    <div 
      className="group p-4 bg-spotify-dark hover:bg-spotify-light transition-colors rounded-lg cursor-pointer relative"
      onClick={() => playSong(song)}
    >
      <div className="relative aspect-square mb-4 shadow-2xl">
        <img 
          src={song.thumbnail} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-md"
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
          {isActive && isPlaying ? <div className="w-4 h-4 bg-black rounded-sm" /> : <Play size={24} className="text-black fill-black ml-1" />}
        </button>
      </div>
      <div className="font-bold truncate mb-1">{song.title}</div>
      <div className="text-sm text-spotify-gray truncate">{song.artist}</div>
    </div>
  );
};
