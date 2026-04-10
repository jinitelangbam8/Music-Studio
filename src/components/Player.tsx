import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useMusic } from '@/lib/MusicContext';

export const Player = () => {
  const { currentSong, isPlaying, progress, volume, togglePlay, nextSong, prevSong, seek, setVolume } = useMusic();

  if (!currentSong) return null;

  return (
    <div className="h-24 bg-black border-t border-white/10 px-4 flex items-center justify-between">
      {/* Song Info */}
      <div className="flex items-center gap-4 w-1/3">
        <img src={currentSong.thumbnail} alt={currentSong.title} className="w-14 h-14 rounded-md object-cover shadow-lg" />
        <div>
          <div className="text-sm font-semibold hover:underline cursor-pointer">{currentSong.title}</div>
          <div className="text-xs text-spotify-gray hover:underline cursor-pointer">{currentSong.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-xl">
        <div className="flex items-center gap-6">
          <Shuffle size={16} className="text-spotify-gray hover:text-white cursor-pointer" />
          <SkipBack size={20} className="text-spotify-gray hover:text-white cursor-pointer" onClick={prevSong} />
          <button 
            onClick={togglePlay}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} className="text-black fill-black" /> : <Play size={20} className="text-black fill-black ml-1" />}
          </button>
          <SkipForward size={20} className="text-spotify-gray hover:text-white cursor-pointer" onClick={nextSong} />
          <Repeat size={16} className="text-spotify-gray hover:text-white cursor-pointer" />
        </div>
        
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] text-spotify-gray w-8 text-right">
            {formatTime((progress / 100) * currentSong.duration)}
          </span>
          <Slider 
            value={[progress]} 
            max={100} 
            step={0.1} 
            onValueChange={(val) => seek(val[0])}
            className="w-full"
          />
          <span className="text-[10px] text-spotify-gray w-8">
            {formatTime(currentSong.duration)}
          </span>
        </div>
      </div>

      {/* Volume & Extra */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <Volume2 size={18} className="text-spotify-gray" />
        <Slider 
          value={[volume * 100]} 
          max={100} 
          onValueChange={(val) => setVolume(val[0] / 100)}
          className="w-24"
        />
        <Maximize2 size={18} className="text-spotify-gray hover:text-white cursor-pointer" />
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
