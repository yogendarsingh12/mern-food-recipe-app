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
      title={isDark ? 'Switch to Light Studio' : 'Switch to Dark Studio'}
      className={`relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 select-none group ${
        isDark
          ? 'bg-zinc-900 text-amber-400 hover:bg-zinc-800 border border-zinc-800 shadow-md shadow-amber-500/10'
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
      } ${className}`}
      aria-label="Toggle dark/light theme"
    >
      <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 rotate-0 scale-100 group-hover:rotate-45 text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 rotate-0 scale-100 group-hover:-rotate-12 text-slate-700" />
        )}
      </div>
    </button>
  );
}

