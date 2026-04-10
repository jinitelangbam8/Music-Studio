import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Music } from 'lucide-react';

export const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-spotify-black">
        <div className="animate-pulse text-spotify-green font-bold">Loading Profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-spotify-black p-8 text-center">
        <User size={64} className="text-spotify-gray mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
        <p className="text-spotify-gray mb-6">Please log in to view your profile information.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-spotify-light/30 to-spotify-black p-8 overflow-y-auto spotify-scroll">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <Avatar className="w-48 h-48 border-4 border-spotify-green shadow-2xl">
            <AvatarImage src={userData.photoURL} />
            <AvatarFallback className="text-4xl bg-spotify-light">{userData.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-spotify-gray">Profile</span>
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">{userData.displayName}</h1>
            <div className="flex items-center gap-4 text-spotify-gray font-medium">
              <span className="flex items-center gap-1"><Music size={16} /> 0 Playlists</span>
              <span className="flex items-center gap-1">• 0 Following</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-spotify-dark border-white/5 col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-spotify-gray">
                  <User size={18} />
                  <span>Display Name</span>
                </div>
                <span className="font-semibold">{userData.displayName}</span>
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-spotify-gray">
                  <Mail size={18} />
                  <span>Email</span>
                </div>
                <span className="font-semibold">{userData.email}</span>
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-spotify-gray">
                  <Calendar size={18} />
                  <span>Member Since</span>
                </div>
                <span className="font-semibold">
                  {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-spotify-dark border-white/5">
            <CardHeader>
              <CardTitle className="text-xl">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                Account Help
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
