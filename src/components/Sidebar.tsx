import React from 'react';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = ({ onHomeClick, currentView }: { onHomeClick?: () => void, currentView?: string }) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col p-6 gap-6">
      <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={onHomeClick}>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm" />
        </div>
        <span className="text-xl font-bold tracking-tight">Spotify</span>
      </div>

      <nav className="flex flex-col gap-4">
        <SidebarItem 
          icon={<Home size={24} />} 
          label="Home" 
          active={currentView === 'home'} 
          onClick={onHomeClick}
        />
        <SidebarItem icon={<Search size={24} />} label="Search" />
        <SidebarItem icon={<Library size={24} />} label="Your Library" />
      </nav>

      <div className="mt-8 flex flex-col gap-4">
        <SidebarItem icon={<Plus className="bg-spotify-gray/20 p-1 rounded-sm" size={24} />} label="Create Playlist" />
        <SidebarItem icon={<Heart className="bg-gradient-to-br from-indigo-700 to-blue-300 p-1 rounded-sm" size={24} />} label="Liked Songs" />
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="text-xs text-spotify-gray hover:text-white cursor-pointer mb-2">Cookies</div>
        <div className="text-xs text-spotify-gray hover:text-white cursor-pointer">Privacy Policy</div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
    "flex items-center gap-4 cursor-pointer transition-colors font-semibold",
    active ? "text-white" : "text-spotify-gray hover:text-white"
  )}>
    {icon}
    <span>{label}</span>
  </div>
);
