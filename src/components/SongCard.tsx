import React from 'react';
import { Play, MoreVertical, Trash2 } from 'lucide-react';
import { Song, useMusic } from '@/lib/MusicContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { db, auth } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

interface SongCardProps {
  song: Song;
  onDelete?: (id: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onDelete }) => {
  const { playSong, currentSong, isPlaying } = useMusic();
  const isActive = currentSong?.id === song.id;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!auth.currentUser) return;
    
    try {
      await deleteDoc(doc(db, 'songs', song.id));
      if (onDelete) onDelete(song.id);
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

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
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger 
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 cursor-pointer border-none outline-none"
            >
              <MoreVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-spotify-light border-white/10 text-white">
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer"
              >
                <Trash2 size={16} className="mr-2" />
                <span>Delete Song</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="font-bold truncate mb-1">{song.title}</div>
      <div className="text-sm text-spotify-gray truncate">{song.artist}</div>
    </div>
  );
};
