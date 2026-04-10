import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Auth = ({ onViewProfile }: { onViewProfile?: () => void }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date().toISOString()
          });
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => signOut(auth);

  if (!user) {
    return (
      <Button onClick={login} className="bg-white text-black hover:bg-white/90 rounded-full px-8 font-bold">
        Log in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 bg-black/50 hover:bg-white/10 p-1 pr-3 rounded-full cursor-pointer transition-colors border-none outline-none">
        <Avatar className="w-7 h-7">
          <AvatarImage src={user.photoURL} />
          <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-bold truncate max-w-[100px]">{user.displayName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-spotify-light border-white/10 text-white w-48">
        <DropdownMenuItem onClick={onViewProfile} className="focus:bg-white/10 cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
