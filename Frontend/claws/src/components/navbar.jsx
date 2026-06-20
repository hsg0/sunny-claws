'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsOpen(false);
  };

  const handleLogout = () => {
    console.log('User logged out');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              🐾 CLAWS
            </div>
          </Link>

          {/* Right Side: Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {theme === 'light' ? '☀️' : '🌙'} Menu
              </span>
              <span className="text-lg">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-50"
              >
                
                {/* Theme Toggle Option */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-b border-gray-200 dark:border-slate-700"
                >
                  <span className="text-gray-800 dark:text-white">
                    {theme === 'light' ? '🌙 Switch to Dark' : '☀️ Switch to Light'}
                  </span>
                </button>

                {/* Profile Button */}
                <Link href="/profile" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-800 dark:text-white">👤 Profile</span>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
