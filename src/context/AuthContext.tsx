"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types/types';
import { isProfileComplete } from '@/lib/profileUtils';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  credits: number;
  setCredits: (credits: number) => void;
  userProfile: UserProfile | null;
  profileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    // This will hold the unsubscribe function for the Firestore listener
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // If a user was previously logged in, we need to unsubscribe from their document listener
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }

      if (currentUser) {
        // User is signed in, let's listen to their data in real-time
        const userDocRef = doc(db, 'users', currentUser.uid);

        unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data() as UserProfile;
            // Update credits whenever the document changes
            setCredits(data.credits || 0);
            setUserProfile(data);

            // Check if profile is complete using centralized logic
            const isComplete = isProfileComplete(data);
            setProfileComplete(isComplete);
          } else {
            // This can happen if signup is not complete before this listener attaches
            logger.debug("User document doesn't exist yet, waiting for signup completion");
            setCredits(0);
            setUserProfile(null);
            setProfileComplete(false);
          }
          setLoading(false);
        }, (error) => {
          logger.error("Error listening to user document", error);
          setCredits(0);
          setUserProfile(null);
          setProfileComplete(false);
          setLoading(false);
        });

      } else {
        // User is signed out
        setCredits(0);
        setUserProfile(null);
        setProfileComplete(false);
        setLoading(false);
      }
    });

    // Cleanup function: Unsubscribe from both auth and Firestore listeners when the provider unmounts
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // PERFORMANCE FIX: Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, loading, credits, setCredits, userProfile, profileComplete }),
    [user, loading, credits, userProfile, profileComplete]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
