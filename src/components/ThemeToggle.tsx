'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-13 rounded-full border border-[#d2cecb] bg-[#f4f2f0] dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  return (
    <button
      type="button"
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative flex h-8 w-13 cursor-pointer items-center rounded-full border border-[#d2cecb] bg-[#f4f2f0] p-0.5 transition-[border-color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#999ba3] active:scale-[0.96] focus:outline-none dark:border-slate-800 dark:bg-slate-900"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`flex size-7 transform items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] dark:bg-[#0c0a08] ${
          theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <Moon size={11} className="text-[#0c0a08] dark:text-white" />
        ) : (
          <Sun size={11} className="text-[#0c0a08] dark:text-white" />
        )}
      </div>
    </button>
  );
}
