'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();

  // Listen for Enter key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        router.push('/public');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Clean up listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [router]);

  const handleStart = () => {
    router.push('/public');
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 font-sans">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center justify-center py-32 px-16 text-center">
        
        {/* Welcome Logo */}
        <div className="text-6xl mb-8">🐾</div>

        {/* Main Heading */}
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Welcome to CLAWS
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-md">
          Your friendly companion app designed for everyone
        </p>

        {/* Call to Action */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg border-2 border-blue-200 dark:border-blue-600">
          <button onClick={handleStart} className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
            Ready to get started?
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
            Press ENTER →
          </p>
          </button>
        </div>

        {/* Bottom Info */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-16">
          Made with ❤️ for you
        </p>
      </main>
    </div>
  );
}
