import React from 'react';
import { Utensils, Sparkles, Compass } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-xl border-b border-stone-200/80 dark:border-zinc-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 select-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-brand-500/25 shrink-0">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white font-display">
                  Vyanjan
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse hidden sm:inline-block" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-stone-400 dark:text-zinc-500 -mt-1 tracking-widest uppercase hidden xs:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Right Action Controls: 24 Language Selector & Dark/Light Theme */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Multi-Language Selector */}
            <LanguageSelector />

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
