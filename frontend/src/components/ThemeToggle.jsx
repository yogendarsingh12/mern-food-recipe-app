import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative p-2.5 rounded-2xl transition-all duration-300 select-none group ${
        isDark
          ? 'bg-zinc-800/90 text-amber-400 hover:bg-zinc-700 border border-zinc-700/80 shadow-md shadow-amber-500/10'
          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 shadow-xs'
      } ${className}`}
      aria-label="Toggle dark/light theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100 group-hover:rotate-45 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100 group-hover:-rotate-12 text-stone-700" />
        )}
      </div>
    </button>
  );
}

