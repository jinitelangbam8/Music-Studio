import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Player } from '@/components/Player';
import { SongCard } from '@/components/SongCard';
import { Auth } from '@/components/Auth';
import { Profile } from '@/components/Profile';
import { MusicProvider, useMusic, Song } from '@/lib/MusicContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, limit } from 'firebase/firestore';

const HomeContent = ({ onViewProfile }: { onViewProfile: () => void }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const { setPlaylist } = useMusic();

  const fetchSongs = async () => {
    try {
      const q = query(collection(db, 'songs'), limit(50));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Seed initial songs if collection is empty
        const initialSongs = await fetch('/api/songs').then(res => res.json());
        for (const song of initialSongs) {
          await addDoc(collection(db, 'songs'), song);
        }
        fetchSongs(); // Re-fetch after seeding
        return;
      }

      const songsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Song[];
      
      setSongs(songsData);
      setPlaylist(songsData);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [setPlaylist]);

  const handleDeleteSong = (id: string) => {
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-spotify-light/50 to-spotify-black">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 sticky top-0 z-10 bg-spotify-black/20 backdrop-blur-sm">
        <div className="flex gap-4">
          <button className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-spotify-gray cursor-not-allowed">
            <ChevronLeft size={24} />
          </button>
          <button className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-spotify-gray cursor-not-allowed">
            <ChevronRight size={24} />
          </button>
        </div>
        <Auth onViewProfile={onViewProfile} />
      </header>

      <ScrollArea className="flex-1 px-8 pb-8 spotify-scroll">
        <div className="max-w-7xl mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Good afternoon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {songs.slice(0, 6).map(song => (
                <div key={song.id} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors rounded-md overflow-hidden group cursor-pointer">
                  <img src={song.thumbnail} alt={song.title} className="w-20 h-20 object-cover shadow-lg" />
                  <span className="font-bold truncate">{song.title}</span>
                  <div className="ml-auto mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center shadow-xl">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold hover:underline cursor-pointer">Made For You</h2>
              <span className="text-xs font-bold text-spotify-gray hover:underline cursor-pointer uppercase tracking-widest">Show all</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {songs.map(song => (
                <SongCard key={song.id} song={song} onDelete={handleDeleteSong} />
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'profile'>('home');

  return (
    <MusicProvider>
      <div className="flex h-screen overflow-hidden select-none">
        <Sidebar onHomeClick={() => setView('home')} currentView={view} />
        {view === 'home' ? (
          <HomeContent onViewProfile={() => setView('profile')} />
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 flex items-center justify-end px-8 sticky top-0 z-10 bg-spotify-black/20 backdrop-blur-sm">
              <Auth onViewProfile={() => setView('profile')} />
            </header>
            <Profile />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Player />
      </div>
    </MusicProvider>
  );
}
