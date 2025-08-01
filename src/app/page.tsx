"use client";

import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { WelcomePage } from '@/components/WelcomePage';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // The homepage is now always the WelcomePage.
  // The navbar will correctly show if the user is logged in or not.
  return <WelcomePage />;
}